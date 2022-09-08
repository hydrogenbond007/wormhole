module token_bridge::bridge_state {
    use std::table::{Self, Table};
    use aptos_framework::type_info::{TypeInfo, type_of, account_address, type_name};
    use aptos_framework::account::{Self, SignerCapability, create_signer_with_capability};
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability, FreezeCapability, initialize};
    use aptos_framework::aptos_coin::{AptosCoin};
    use aptos_framework::string::{utf8};
    use aptos_framework::bcs::{to_bytes};
    use aptos_framework::hash::{sha3_256};

    use wormhole::u256::{Self, U256};
    use wormhole::u16::{U16};
    use wormhole::emitter::{EmitterCapability};
    use wormhole::state::{get_chain_id, get_governance_contract};
    use wormhole::wormhole;
    use wormhole::set::{Self, Set};
    use wormhole::vaa::{Self, parse_and_verify};

    use token_bridge::transfer;
    use token_bridge::transfer_result::{Self, TransferResult};
    use token_bridge::asset_meta::{Self, AssetMeta};
    use token_bridge::utils::{hash_type_info};
    //use token_bridge::vaa::{parse_verify_and_replay_protect};

    friend token_bridge::bridge_implementation;
    friend token_bridge::contract_upgrade;
    friend token_bridge::register_chain;
    friend token_bridge::token_bridge;
    friend token_bridge::vaa;

    #[test_only]
    friend token_bridge::token_bridge_test;

    const E_IS_NOT_WRAPPED_ASSET: u64 = 0;
    const E_COIN_CAP_DOES_NOT_EXIST: u64 = 1;
    const E_COIN_NOT_REGISTERED: u64 = 2;
    const E_FEE_EXCEEDS_AMOUNT: u64 = 3;

    struct Asset has key, store {
        chain_id: U16,
        asset_address: vector<u8>,
    }

    struct CoinCapabilities<phantom CoinType> has key, store {
        mint_cap: MintCapability<CoinType>,
        freeze_cap: FreezeCapability<CoinType>,
        burn_cap: BurnCapability<CoinType>,
    }

    // the native chain and address of a wrapped token
    struct OriginInfo has store, copy, drop {
        token_address: vector<u8>,
        token_chain: U16,
    }

    struct State has key, store {
        governance_chain_id: U16,
        governance_contract: vector<u8>,

        // Set of consumed governance actions
        consumed_vaas: Set<vector<u8>>,

        // TODO: does this nested mapping setup buy us anything over
        // (chainId, nativeAddress) => wrappedAddress?
        // that would be more efficient since it's a single hash and a single lookup
        //
        // Mapping of wrapped assets (chain_id => origin_address => wrapped_address)
        //
        // A Wormhole wrapped coin on Aptos is identified by a single address, because
        // we assume it was initialized from the CoinType "deployer::coin::T", where the module and struct
        // names are fixed.
        //
        // TODO: maybe this should map to TypeInfos
        origin_info_to_wrapped_assets: Table<OriginInfo, vector<u8>>,

        wrapped_assets_to_origin_info: Table<vector<u8>, OriginInfo>,

        // https://github.com/aptos-labs/aptos-core/blob/devnet/aptos-move/framework/aptos-stdlib/sources/type_info.move
        // Mapping of native asset TypeInfo sha3_256 hash (32 bytes) => TypeInfo
        // We have to identify native assets using a 32 byte identifier, because that is what fits in
        // TokenTransferWithPayload struct, among others.
        assets_to_type_info: Table<vector<u8>, TypeInfo>,

        // Mapping to safely identify wrapped assets from a 32 byte hash of its TypeInfo
        // TODO: use a Set
        is_wrapped_asset: Table<vector<u8>, bool>,

        // Mapping to safely identify native assets from a 32 byte hash of its TypeInfo
        // all CoinTypes that aren't Wormhole wrapped assets are presumed native assets...
        // TODO: use a Set
        is_registered_native_asset: Table<vector<u8>, bool>,

        wrapped_asset_signer_capabilities: Table<vector<u8>, SignerCapability>,

        signer_cap: SignerCapability,

        emitter_cap: EmitterCapability,

        // Mapping of native assets to amount outstanding on other chains
        outstanding_bridged: Table<vector<u8>, U256>, // should be address => u256

        // Mapping of bridge contracts on other chains
        registered_emitters: Table<U16, vector<u8>>,
    }

    // getters

    // TODO: these shouldn't be entry functions...

    public entry fun vaa_is_consumed(hash: vector<u8>): bool acquires State {
        let state = borrow_global<State>(@token_bridge);
        set::contains(&state.consumed_vaas, hash)
    }

    public entry fun governance_chain_id(): U16 acquires State { //should return u16
        let state = borrow_global<State>(@token_bridge);
        return state.governance_chain_id
    }

    public entry fun governance_contract(): vector<u8> acquires State { //should return u16
        let state = borrow_global<State>(@token_bridge);
        return state.governance_contract
    }

    public entry fun wrapped_asset(native_info: OriginInfo): vector<u8> acquires State {
        let origin_info_to_wrapped_assets = &borrow_global<State>(@token_bridge).origin_info_to_wrapped_assets;
        *table::borrow(origin_info_to_wrapped_assets, native_info)
    }

    public entry fun origin_info(token_address: vector<u8>): OriginInfo acquires State {
        let wrapped_assets_to_origin_info = &borrow_global<State>(@token_bridge).wrapped_assets_to_origin_info;
        *table::borrow(wrapped_assets_to_origin_info, token_address)
    }

    public entry fun asset_type_info(token_address: vector<u8>): TypeInfo acquires State {
        let assets_to_type_info = &borrow_global<State>(@token_bridge).assets_to_type_info;
        *table::borrow(assets_to_type_info, token_address)
    }

    public entry fun get_registered_emitter(chain_id: U16): vector<u8> acquires State {
        let state = borrow_global<State>(@token_bridge);
        *table::borrow(&state.registered_emitters, chain_id)
    }

    public entry fun outstanding_bridged(token: vector<u8>): U256 acquires State {
        let state = borrow_global<State>(@token_bridge);
        *table::borrow(&state.outstanding_bridged, token)
    }

    // given the hash of the TypeInfo of a Coin, this tells us if it is registered with Token Bridge
    public fun is_registered_native_asset(token: vector<u8>): bool acquires State {
        let state = borrow_global<State>(@token_bridge);
        //TODO - make is_registered_native_asset a set
        if (table::contains(&state.is_registered_native_asset, token)){
            return true
        } else{
            return false
        }
    }

    // the input arg is the hash of the TypeInfo of the wrapped asset
    public entry fun is_wrapped_asset(token: vector<u8>): bool acquires State {
        let state = borrow_global<State>(@token_bridge);
        //TODO - make is_wrapped_asset a set
        if (table::contains(&state.is_wrapped_asset, token)){
            return true
        } else{
            return false
        }
    }

    public entry fun get_origin_info_token_address(info: OriginInfo): vector<u8>{
        info.token_address
    }

    public entry fun get_origin_info_token_chain(info: OriginInfo): U16{
        info.token_chain
    }

    public(friend) fun mint_wrapped<CoinType>(amount:u64, token: vector<u8>): Coin<CoinType> acquires CoinCapabilities, State{
        assert!(is_wrapped_asset(token), E_IS_NOT_WRAPPED_ASSET);
        assert!(exists<CoinCapabilities<CoinType>>(@token_bridge), E_COIN_CAP_DOES_NOT_EXIST);
        let caps = borrow_global<CoinCapabilities<CoinType>>(@token_bridge);
        let mint_cap = &caps.mint_cap;
        let coins = coin::mint<CoinType>(amount, mint_cap);
        coins
    }

    public(friend) fun burn_wrapped<CoinType>(amount:u64, token: vector<u8>) acquires CoinCapabilities, State{
        assert!(is_wrapped_asset(token), E_IS_NOT_WRAPPED_ASSET);
        assert!(exists<CoinCapabilities<CoinType>>(@token_bridge), E_COIN_CAP_DOES_NOT_EXIST);
        let caps = borrow_global<CoinCapabilities<CoinType>>(@token_bridge);
        let burn_cap = &caps.burn_cap;
        let coins = coin::withdraw<CoinType>(&token_bridge_signer(), amount);
        coin::burn<CoinType>(coins, burn_cap);
    }

    // this function is called in tandem with bridge_implementation::create_wrapped_coin_type
    // initializes a coin for CoinType, updates mappings in State
    public entry fun create_wrapped_coin<CoinType>(vaa: vector<u8>) acquires State{
        //TODO: parse and verify and replay protect
        //let vaa = parse_verify_and_replay_protect(vaa);
        let vaa = parse_and_verify(vaa);
        let _asset_meta: AssetMeta = asset_meta::parse(vaa::get_payload(&vaa));

        // fetch signer_cap and create signer for CoinType
        let coin_type_deployer = account_address(&type_of<CoinType>());
        let wrapped_coin_signer_caps = &borrow_global<State>(@token_bridge).wrapped_asset_signer_capabilities;
        let coin_signer_cap = table::borrow(wrapped_coin_signer_caps, to_bytes(&coin_type_deployer));
        let coin_signer = create_signer_with_capability(coin_signer_cap);

        // initialize new coin using CoinType
        let name = asset_meta::get_name(&_asset_meta);
        let symbol = asset_meta::get_symbol(&_asset_meta);
        let decimals = asset_meta::get_decimals(&_asset_meta);
        let monitor_supply = true;
        let (burn_cap, freeze_cap, mint_cap) = initialize<CoinType>(&coin_signer, utf8(name), utf8(symbol), decimals, monitor_supply);

        // update the following two mappings in State
        // 1. (native chain, native address) => wrapped address
        // 2. wrapped address => (native chain, native address)
        let native_token_address = asset_meta::get_token_address(& _asset_meta);
        let native_token_chain = asset_meta::get_token_chain(& _asset_meta);
        let native_info = OriginInfo {token_address: native_token_address, token_chain: native_token_chain};

        let token_address = sha3_256(to_bytes(&type_name<CoinType>()));
        set_origin_info(token_address, &native_info);
        set_wrapped_asset(&native_info, token_address);
        set_wrapped_asset_type_info(token_address, type_of<CoinType>());

        // store coin capabilities
        let _token_bridge_signer = token_bridge_signer();
        let coin_caps = CoinCapabilities<CoinType> { mint_cap: mint_cap, freeze_cap: freeze_cap, burn_cap: burn_cap};
        move_to(&_token_bridge_signer, coin_caps);

        vaa::destroy(vaa);
    }

    // transfer a native or wraped token from sender to token_bridge
    public entry fun transfer_tokens<CoinType>(coins: Coin<CoinType>, relayer_fee: u128): TransferResult acquires State {
        assert!(coin::is_account_registered<CoinType>(@token_bridge), E_COIN_NOT_REGISTERED);

        let token_address = hash_type_info<CoinType>();
        let amount = coin::value<CoinType>(&coins);

        // transfer tokens from sender to token_bridge
        coin::deposit<CoinType>(@token_bridge, coins);

        // return TransferResult encapsulating details of token transferred
        let origin_chain;
        let origin_address;

        if (is_wrapped_asset(token_address)) {
            let _origin_info = origin_info(token_address);
            origin_chain = _origin_info.token_chain;
            origin_address = _origin_info.token_address;
        } else {
             if (!is_registered_native_asset(token_address)) {
                set_native_asset_type_info(token_address, type_of<CoinType>());
             };
            origin_chain = get_chain_id();
            origin_address = token_address;
        };

        // TODO - normalize amount by using helpers from utils.move
        let normalized_amount = u256::from_u64(amount);
        // TODO - normalize relayer fee
        let normalized_relayer_fee = u256::from_u128(relayer_fee);
        let wormhole_fee = u256::from_u64(0);

        let transfer_result: TransferResult = transfer_result::create(
            origin_chain,
            origin_address,
            normalized_amount,
            normalized_relayer_fee,
            wormhole_fee
        );
        transfer_result
    }

    public entry fun transfer_tokens_with_signer<CoinType>(sender: &signer, amount: u64, relayer_fee: u128): TransferResult acquires State {
        let coins = coin::withdraw<CoinType>(sender, amount);
        transfer_tokens<CoinType>(coins, relayer_fee)
    }

    public(friend) fun log_transfer(
        token_chain: U16,
        token_address: vector<u8>,
        amount: U256,
        recipient_chain: U16,
        recipient: vector<u8>,
        fee: U256,
        message_fee: Coin<AptosCoin>,
        nonce: u64
    ): u64 acquires State{
        let fee_value = coin::value<AptosCoin>(&message_fee);
        assert!(u256::compare(&u256::from_u64(fee_value), &amount)==1, E_FEE_EXCEEDS_AMOUNT);
        // TODO - payloadID is 1 for token transfer?
        let transfer = transfer::create(1, amount, token_address, token_chain, recipient, recipient_chain, fee);
        let payload = transfer::encode(transfer);
        publish_message(
            nonce,
            payload,
            message_fee,
        )
    }

    public(friend) fun publish_message(
        nonce: u64,
        payload: vector<u8>,
        message_fee: Coin<AptosCoin>,
    ): u64 acquires State {
        let emitter_cap = &mut borrow_global_mut<State>(@token_bridge).emitter_cap;
        wormhole::publish_message(
            emitter_cap,
            nonce,
            payload,
            message_fee
        )
    }

    public(friend) fun token_bridge_signer(): signer acquires State {
        create_signer_with_capability(&borrow_global<State>(@token_bridge).signer_cap)
    }

    // setters

    public(friend) fun set_vaa_consumed(hash: vector<u8>) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        set::add(&mut state.consumed_vaas, hash);
    }

    public(friend) fun set_governance_chain_id(governance_chain_id: U16) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        state.governance_chain_id = governance_chain_id;
    }

    public(friend) fun set_governance_contract(governance_contract: vector<u8>) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        state.governance_contract = governance_contract;
    }

    public(friend) fun set_registered_emitter(chain_id: U16, bridge_contract: vector<u8>) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        table::upsert(&mut state.registered_emitters, chain_id, bridge_contract);
    }

    // OriginInfo => WrappedAsset
    fun set_wrapped_asset(native_info: &OriginInfo, wrapper: vector<u8>) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        let origin_info_to_wrapped_assets = &mut state.origin_info_to_wrapped_assets;
        table::upsert(origin_info_to_wrapped_assets, *native_info, wrapper);
        let is_wrapped_asset = &mut state.is_wrapped_asset;
        table::upsert(is_wrapped_asset, wrapper, true);
    }

    // WrappedAsset => OriginInfo
    fun set_origin_info(wrapper: vector<u8>, origin_info: &OriginInfo) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        let wrapped_assets_to_origin_info = &mut state.wrapped_assets_to_origin_info;
        table::upsert(wrapped_assets_to_origin_info, wrapper, *origin_info);
        let is_wrapped_asset = &mut state.is_wrapped_asset;
        table::upsert(is_wrapped_asset, wrapper, true);
    }

    // 32-byte native asset address => type info
    public entry fun set_native_asset_type_info(token_address: vector<u8>, type_info: TypeInfo) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        let assets_to_type_info = &mut state.assets_to_type_info;
        if (table::contains(assets_to_type_info, token_address)){
            //TODO: throw error, because we should only be able to set native asset type info once?
            table::remove(assets_to_type_info, token_address);
        };
        table::add(assets_to_type_info, token_address, type_info);
        let is_registered_native_asset = &mut state.is_registered_native_asset;
        table::upsert(is_registered_native_asset, token_address, true);
    }

    // 32-byte wrapped asset address => type info
    public entry fun set_wrapped_asset_type_info(token_address: vector<u8>, type_info: TypeInfo) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        let assets_to_type_info = &mut state.assets_to_type_info;
        if (table::contains(assets_to_type_info, token_address)){
            //TODO: throw error, because we should only be able to set native asset type info once?
            table::remove(assets_to_type_info, token_address);
        };
        table::add(assets_to_type_info, token_address, type_info);
        let is_wrapped_asset = &mut state.is_wrapped_asset;
        table::upsert(is_wrapped_asset, token_address, true);
    }

    public entry fun set_outstanding_bridged(token: vector<u8>, outstanding: U256) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        let outstanding_bridged = &mut state.outstanding_bridged;
        table::upsert(outstanding_bridged, token, outstanding);
    }

    public fun set_wrapped_asset_signer_capability(token: vector<u8>, signer_cap: SignerCapability) acquires State {
        let state = borrow_global_mut<State>(@token_bridge);
        table::upsert(&mut state.wrapped_asset_signer_capabilities, token, signer_cap);
    }

    public(friend) fun init_token_bridge_state(
        signer_cap: SignerCapability,
        emitter_cap: EmitterCapability
    ) {
        let token_bridge = account::create_signer_with_capability(&signer_cap);
        move_to(&token_bridge, State{
            governance_chain_id: get_chain_id(),
            governance_contract: get_governance_contract(),
            consumed_vaas: set::new<vector<u8>>(),
            origin_info_to_wrapped_assets: table::new<OriginInfo, vector<u8>>(),
            wrapped_assets_to_origin_info: table::new<vector<u8>, OriginInfo>(),
            assets_to_type_info: table::new<vector<u8>, TypeInfo>(),
            is_wrapped_asset: table::new<vector<u8>, bool>(),
            is_registered_native_asset: table::new<vector<u8>, bool>(),
            wrapped_asset_signer_capabilities: table::new<vector<u8>, SignerCapability>(),
            signer_cap: signer_cap,
            emitter_cap: emitter_cap,
            outstanding_bridged: table::new<vector<u8>, U256>(),
            registered_emitters: table::new<U16, vector<u8>>(),
            }
        );
    }
}