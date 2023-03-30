/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SigningWormholeSimulator,
  SigningWormholeSimulatorInterface,
} from "../../WormholeSimulator.sol/SigningWormholeSimulator";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IWormhole",
        name: "wormhole_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "devnetGuardian",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "timestamp",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "emitterChainId",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "emitterAddress",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "sequence",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "consistencyLevel",
            type: "uint8",
          },
          {
            internalType: "bytes",
            name: "payload",
            type: "bytes",
          },
          {
            internalType: "uint32",
            name: "guardianSetIndex",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "guardianIndex",
                type: "uint8",
              },
            ],
            internalType: "struct IWormhole.Signature[]",
            name: "signatures",
            type: "tuple[]",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct IWormhole.VM",
        name: "vm_",
        type: "tuple",
      },
    ],
    name: "encodeAndSignMessage",
    outputs: [
      {
        internalType: "bytes",
        name: "signedMessage",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "timestamp",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "emitterChainId",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "emitterAddress",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "sequence",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "consistencyLevel",
            type: "uint8",
          },
          {
            internalType: "bytes",
            name: "payload",
            type: "bytes",
          },
          {
            internalType: "uint32",
            name: "guardianSetIndex",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "guardianIndex",
                type: "uint8",
              },
            ],
            internalType: "struct IWormhole.Signature[]",
            name: "signatures",
            type: "tuple[]",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct IWormhole.VM",
        name: "vm_",
        type: "tuple",
      },
    ],
    name: "encodeObservation",
    outputs: [
      {
        internalType: "bytes",
        name: "encodedObservation",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Vm.Log[]",
        name: "logs",
        type: "tuple[]",
      },
      {
        internalType: "uint32",
        name: "nonce",
        type: "uint32",
      },
      {
        internalType: "uint16",
        name: "emitterChainId",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "emitterAddress",
        type: "address",
      },
    ],
    name: "fetchSignedBatchVAAFromLogs",
    outputs: [
      {
        internalType: "bytes",
        name: "signedMessage",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Vm.Log",
        name: "log",
        type: "tuple",
      },
      {
        internalType: "uint16",
        name: "emitterChainId",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "emitterAddress",
        type: "address",
      },
    ],
    name: "fetchSignedMessageFromLogs",
    outputs: [
      {
        internalType: "bytes",
        name: "signedMessage",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Vm.Log[]",
        name: "logs",
        type: "tuple[]",
      },
    ],
    name: "fetchWormholeMessageFromLog",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Vm.Log[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
    ],
    name: "invalidateVM",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "topics",
            type: "bytes32[]",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Vm.Log",
        name: "log",
        type: "tuple",
      },
    ],
    name: "parseVMFromLogs",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "version",
            type: "uint8",
          },
          {
            internalType: "uint32",
            name: "timestamp",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "nonce",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "emitterChainId",
            type: "uint16",
          },
          {
            internalType: "bytes32",
            name: "emitterAddress",
            type: "bytes32",
          },
          {
            internalType: "uint64",
            name: "sequence",
            type: "uint64",
          },
          {
            internalType: "uint8",
            name: "consistencyLevel",
            type: "uint8",
          },
          {
            internalType: "bytes",
            name: "payload",
            type: "bytes",
          },
          {
            internalType: "uint32",
            name: "guardianSetIndex",
            type: "uint32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
              {
                internalType: "uint8",
                name: "guardianIndex",
                type: "uint8",
              },
            ],
            internalType: "struct IWormhole.Signature[]",
            name: "signatures",
            type: "tuple[]",
          },
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
        ],
        internalType: "struct IWormhole.VM",
        name: "vm_",
        type: "tuple",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "setMessageFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vm",
    outputs: [
      {
        internalType: "contract Vm",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wormhole",
    outputs: [
      {
        internalType: "contract IWormhole",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620029c7380380620029c783398101604081905262000034916200059c565b600080546001600160a01b0319166001600160a01b03841617905560018190556040516001625e79b760e01b0319815260048101829052620000d690600080516020620029a78339815191529063ffa18649906024016020604051808303816000875af1158015620000aa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000d09190620005cd565b620000de565b5050620007fa565b60008060009054906101000a90046001600160a01b03166001600160a01b0316631cfe79516040518163ffffffff1660e01b8152600401602060405180830381865afa15801562000133573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200015991906200060e565b6040805163ffffffff8316602082015260029181019190915290915060009060600160408051808303601f1901815290829052805160209091012060008054630667f9d760e41b84526001600160a01b031660048401526024830182905290925090600080516020620029a78339815191529063667f9d70906044016020604051808303816000875af1158015620001f5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200021b91906200062c565b905060015b81811015620002ef576000546040805160208082018790528251808303820181529183019092528051910120600080516020620029a7833981519152916370ca10bb916001600160a01b03909116906200027c90859062000646565b60405160e084901b6001600160e01b03191681526001600160a01b039092166004830152602482015260006044820152606401600060405180830381600087803b158015620002ca57600080fd5b505af1158015620002df573d6000803e3d6000fd5b5050505060018101905062000220565b50600080546040805160208082018790528251808303820181529183019092528051910120600080516020620029a7833981519152926370ca10bb926001600160a01b031691620003409162000646565b60405160e084901b6001600160e01b03191681526001600160a01b03928316600482015260248101919091529087166044820152606401600060405180830381600087803b1580156200039257600080fd5b505af1158015620003a7573d6000803e3d6000fd5b50506000546040516370ca10bb60e01b81526001600160a01b0390911660048201526024810185905260016044820152600080516020620029a783398151915292506370ca10bb9150606401600060405180830381600087803b1580156200040e57600080fd5b505af115801562000423573d6000803e3d6000fd5b505060008054604051637ca8cbad60e11b815263ffffffff881660048201529193506001600160a01b0316915063f951975a90602401600060405180830381865afa15801562000477573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620004a19190810190620006e2565b518051909150600114620004fc5760405162461bcd60e51b815260206004820152601560248201527f677561726469616e732e6c656e67746820213d2031000000000000000000000060448201526064015b60405180910390fd5b846001600160a01b0316816000815181106200051c576200051c620007e4565b60200260200101516001600160a01b0316146200057c5760405162461bcd60e51b815260206004820152601f60248201527f696e636f727265637420677561726469616e20736574206f76657272696465006044820152606401620004f3565b5050505050565b6001600160a01b03811681146200059957600080fd5b50565b60008060408385031215620005b057600080fd5b8251620005bd8162000583565b6020939093015192949293505050565b600060208284031215620005e057600080fd5b8151620005ed8162000583565b9392505050565b805163ffffffff811681146200060957600080fd5b919050565b6000602082840312156200062157600080fd5b620005ed82620005f4565b6000602082840312156200063f57600080fd5b5051919050565b808201808211156200066857634e487b7160e01b600052601160045260246000fd5b92915050565b634e487b7160e01b600052604160045260246000fd5b604080519081016001600160401b0381118282101715620006a957620006a96200066e565b60405290565b604051601f8201601f191681016001600160401b0381118282101715620006da57620006da6200066e565b604052919050565b60006020808385031215620006f657600080fd5b82516001600160401b03808211156200070e57600080fd5b90840190604082870312156200072357600080fd5b6200072d62000684565b8251828111156200073d57600080fd5b8301601f810188136200074f57600080fd5b8051838111156200076457620007646200066e565b8060051b935062000777868501620006af565b818152938201860193868101908a8611156200079257600080fd5b928701925b85841015620007c05783519250620007af8362000583565b828252928701929087019062000797565b845250620007d3915050838501620005f4565b848201528094505050505092915050565b634e487b7160e01b600052603260045260246000fd5b61219d806200080a6000396000f3fe608060405234801561001057600080fd5b506004361061009e5760003560e01c806364bb9bfb1161006657806364bb9bfb1461013857806384acd1bb1461014b578063920539af1461015e5780639404495d14610171578063fb41833e1461019157600080fd5b80630e645295146100a35780631e5a2802146100cc57806323aa2a9d146100df5780633a768463146100f25780634603c12a14610125575b600080fd5b6100b66100b1366004611776565b6101b1565b6040516100c391906118ea565b60405180910390f35b6100dd6100da366004611904565b50565b005b6100dd6100ed366004611940565b61046f565b61010d737109709ecfa91a80626ff3989d68f67f5b1dd12d81565b6040516001600160a01b0390911681526020016100c3565b6100b6610133366004611a34565b610749565b6100b6610146366004611776565b610793565b60005461010d906001600160a01b031681565b6100b661016c366004611b12565b6107e4565b61018461017f366004611b84565b610e78565b6040516100c39190611bb8565b6101a461019f366004611c68565b611034565b6040516100c39190611d00565b606060006101be83610793565b90506101c9816111f3565b610140840152604080516001808252818301909252600091816020015b6040805160808101825260008082526020808301829052928201819052606082015282526000199092019101816101e6579050506001546101408601516040516338d07aa960e21b815260048101929092526024820152909150737109709ecfa91a80626ff3989d68f67f5b1dd12d9063e341eaa4906044016060604051808303816000875af115801561027e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102a29190611dec565b836000815181106102b5576102b5611e23565b6020026020010151604001846000815181106102d3576102d3611e23565b6020026020010151600001856000815181106102f1576102f1611e23565b602002602001015160200183815250838152508360ff1660ff1681525050505060008160008151811061032657610326611e23565b60200260200101516060019060ff16908160ff1681525050836000015160008054906101000a90046001600160a01b03166001600160a01b0316631cfe79516040518163ffffffff1660e01b8152600401602060405180830381865afa158015610394573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103b89190611e39565b8251836000826103ca576103ca611e23565b602002602001015160600151846000815181106103e9576103e9611e23565b6020026020010151600001518560008151811061040857610408611e23565b602002602001015160200151601b8760008151811061042957610429611e23565b60200260200101516040015161043f9190611e6c565b88604051602001610457989796959493929190611ea1565b60405160208183030381529060405292505050919050565b600063436f726560001b9050600081600360008054906101000a90046001600160a01b03166001600160a01b0316639a8a05926040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104d1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104f59190611f17565b85604051602001610539949392919093845260f89290921b6001600160f81b031916602084015260f01b6001600160f01b0319166021830152602382015260430190565b60408051601f19818403018152610160830182526001835263ffffffff421660208481019190915260008484018190528054845163fbe3c2cd60e01b8152945193965090949360608501936001600160a01b039092169263fbe3c2cd926004808401938290030181865afa1580156105b5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d99190611f17565b61ffff16815260200160008054906101000a90046001600160a01b03166001600160a01b031663b172b2226040518163ffffffff1660e01b8152600401602060405180830381865afa158015610633573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106579190611f34565b81526000602080830182905260c860408085019190915260608401879052608084018390528051838152918201905260a090920191906106c6565b6040805160808101825260008082526020808301829052928201819052606082015282526000199092019101816106925790505b508152600060209091018190529091506106df826101b1565b60005460405163f42bc64160e01b81529192506001600160a01b03169063f42bc641906107109084906004016118ea565b600060405180830381600087803b15801561072a57600080fd5b505af115801561073e573d6000803e3d6000fd5b505050505050505050565b6060600061075685611034565b6001815263ffffffff4216602082015261ffff851660608201526001600160a01b0384166080820152905061078a816101b1565b95945050505050565b606081602001518260400151836060015184608001518560a001518660c001518760e001516040516020016107ce9796959493929190611f4d565b6040516020818303038152906040529050919050565b606060008086516001600160401b038111156108025761080261150e565b60405190808252806020026020018201604052801561083b57816020015b6108286114b3565b8152602001906001900390816108205790505b50905060005b87518110156109665761086c88828151811061085f5761085f611e23565b6020026020010151611034565b82828151811061087e5761087e611e23565b60200260200101819052504282828151811061089c5761089c611e23565b60200260200101516020019063ffffffff16908163ffffffff1681525050858282815181106108cd576108cd611e23565b60200260200101516060019061ffff16908161ffff1681525050846001600160a01b031660001b82828151811061090657610906611e23565b602002602001015160800181815250508663ffffffff1682828151811061092f5761092f611e23565b60200260200101516040015163ffffffff160361095457610951600184611fd4565b92505b8061095e81611fed565b915050610841565b50606060008360ff166001600160401b038111156109865761098661150e565b6040519080825280602002602001820160405280156109af578160200160208202803683370190505b5090506000805b8a51811015610b5f578963ffffffff168582815181106109d8576109d8611e23565b60200260200101516040015163ffffffff1603610b4d576000858281518110610a0357610a03611e23565b602002602001015160200151868381518110610a2157610a21611e23565b602002602001015160400151878481518110610a3f57610a3f611e23565b602002602001015160600151888581518110610a5d57610a5d611e23565b602002602001015160800151898681518110610a7b57610a7b611e23565b602002602001015160a001518a8781518110610a9957610a99611e23565b602002602001015160c001518b8881518110610ab757610ab7611e23565b602002602001015160e00151604051602001610ad99796959493929190611f4d565b6040516020818303038152906040529050610af3816111f3565b848460ff1681518110610b0857610b08611e23565b6020026020010181815250508483825183604051602001610b2c9493929190612006565b60405160208183030381529060405294508280610b4890612062565b935050505b80610b5781611fed565b9150506109b6565b506000610bcb600284604051602001610b7891906120a9565b60405160208183030381529060405280519060200120604051602001610bb792919060f89290921b6001600160f81b0319168252600182015260210190565b6040516020818303038152906040526111f3565b60408051600180825281830190925291925060009190816020015b604080516080810182526000808252602080830182905292820181905260608201528252600019909201910181610be65750506001546040516338d07aa960e21b8152600481019190915260248101849052909150737109709ecfa91a80626ff3989d68f67f5b1dd12d9063e341eaa4906044016060604051808303816000875af1158015610c79573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c9d9190611dec565b83600081518110610cb057610cb0611e23565b602002602001015160400184600081518110610cce57610cce611e23565b602002602001015160000185600081518110610cec57610cec611e23565b602002602001015160200183815250838152508360ff1660ff16815250505050600081600081518110610d2157610d21611e23565b60200260200101516060019060ff16908160ff1681525050600260008054906101000a90046001600160a01b03166001600160a01b0316631cfe79516040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d8c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610db09190611e39565b600183600081518110610dc557610dc5611e23565b60200260200101516060015184600081518110610de457610de4611e23565b60200260200101516000015185600081518110610e0357610e03611e23565b602002602001015160200151601b87600081518110610e2457610e24611e23565b602002602001015160400151610e3a9190611e6c565b8d8b8f8e604051602001610e589b9a999897969594939291906120b5565b604051602081830303815290604052975050505050505050949350505050565b60606000805b8351811015610f05577f6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b2848281518110610eba57610eba611e23565b602002602001015160000151600081518110610ed857610ed8611e23565b602002602001015103610ef357610ef0600183612141565b91505b80610efd81611fed565b915050610e7e565b506000816001600160401b03811115610f2057610f2061150e565b604051908082528060200260200182016040528015610f6557816020015b6040805180820190915260608082526020820152815260200190600190039081610f3e5790505b5090506000805b855181101561102a577f6eb224fb001ed210e379b335e35efe88672a8ce935d981a6896b27ffdf52a3b2868281518110610fa857610fa8611e23565b602002602001015160000151600081518110610fc657610fc6611e23565b60200260200101510361101857858181518110610fe557610fe5611e23565b6020026020010151838381518110610fff57610fff611e23565b6020908102919091010152611015600183612141565b91505b8061102281611fed565b915050610f6c565b5090949350505050565b61103c6114b3565b6000826000015160018151811061105557611055611e23565b602002602001015182608001818152505061108d60088260206110789190612141565b6110829190612154565b60208501519061122c565b6001600160401b031660a08301526110a6602082612141565b90506110cd60046110b8836020612141565b6110c29190612154565b60208501519061128f565b63ffffffff1660408301526110e3602082612141565b90506110f0602082612141565b90506111176001611102836020612141565b61110c9190612154565b6020850151906112ec565b60ff1660c083015261112a602082612141565b9050600061114582856020015161134890919063ffffffff16565b9050611152602083612141565b60208501519092506111659083836113a6565b60e08401526111748183612141565b9150818460200151516111879190612154565b6111919083612141565b915083602001515182146111ec5760405162461bcd60e51b815260206004820181905260248201527f6661696c656420746f20706172736520776f726d686f6c65206d65737361676560448201526064015b60405180910390fd5b5050919050565b6000818051906020012060405160200161120f91815260200190565b604051602081830303815290604052805190602001209050919050565b6000611239826008612141565b835110156112805760405162461bcd60e51b8152602060048201526014602482015273746f55696e7436345f6f75744f66426f756e647360601b60448201526064016111e3565b50818101600801515b92915050565b600061129c826004612141565b835110156112e35760405162461bcd60e51b8152602060048201526014602482015273746f55696e7433325f6f75744f66426f756e647360601b60448201526064016111e3565b50016004015190565b60006112f9826001612141565b8351101561133f5760405162461bcd60e51b8152602060048201526013602482015272746f55696e74385f6f75744f66426f756e647360681b60448201526064016111e3565b50016001015190565b6000611355826020612141565b8351101561139d5760405162461bcd60e51b8152602060048201526015602482015274746f55696e743235365f6f75744f66426f756e647360581b60448201526064016111e3565b50016020015190565b6060816113b481601f612141565b10156113f35760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b60448201526064016111e3565b6113fd8284612141565b845110156114415760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b60448201526064016111e3565b60608215801561146057604051915060008252602082016040526114aa565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015611499578051835260209283019201611481565b5050858452601f01601f1916604052505b50949350505050565b604080516101608101825260008082526020820181905291810182905260608082018390526080820183905260a0820183905260c0820183905260e08201819052610100820183905261012082015261014081019190915290565b634e487b7160e01b600052604160045260246000fd5b604051608081016001600160401b03811182821017156115465761154661150e565b60405290565b60405161016081016001600160401b03811182821017156115465761154661150e565b604080519081016001600160401b03811182821017156115465761154661150e565b604051601f8201601f191681016001600160401b03811182821017156115b9576115b961150e565b604052919050565b60ff811681146100da57600080fd5b80356115db816115c1565b919050565b63ffffffff811681146100da57600080fd5b80356115db816115e0565b61ffff811681146100da57600080fd5b80356115db816115fd565b80356001600160401b03811681146115db57600080fd5b600082601f83011261164057600080fd5b81356001600160401b038111156116595761165961150e565b61166c601f8201601f1916602001611591565b81815284602083860101111561168157600080fd5b816020850160208301376000918101602001919091529392505050565b60006001600160401b038211156116b7576116b761150e565b5060051b60200190565b600082601f8301126116d257600080fd5b813560206116e76116e28361169e565b611591565b82815260079290921b8401810191818101908684111561170657600080fd5b8286015b8481101561176b57608081890312156117235760008081fd5b61172b611524565b813581528482013585820152604080830135611746816115c1565b90820152606082810135611759816115c1565b9082015283529183019160800161170a565b509695505050505050565b60006020828403121561178857600080fd5b81356001600160401b038082111561179f57600080fd5b9083019061016082860312156117b457600080fd5b6117bc61154c565b6117c5836115d0565b81526117d3602084016115f2565b60208201526117e4604084016115f2565b60408201526117f56060840161160d565b60608201526080830135608082015261181060a08401611618565b60a082015261182160c084016115d0565b60c082015260e08301358281111561183857600080fd5b6118448782860161162f565b60e0830152506101006118588185016115f2565b90820152610120838101358381111561187057600080fd5b61187c888287016116c1565b91830191909152506101409283013592810192909252509392505050565b60005b838110156118b557818101518382015260200161189d565b50506000910152565b600081518084526118d681602086016020860161189a565b601f01601f19169290920160200192915050565b6020815260006118fd60208301846118be565b9392505050565b60006020828403121561191657600080fd5b81356001600160401b0381111561192c57600080fd5b6119388482850161162f565b949350505050565b60006020828403121561195257600080fd5b5035919050565b60006040828403121561196b57600080fd5b61197361156f565b905081356001600160401b038082111561198c57600080fd5b818401915084601f8301126119a057600080fd5b813560206119b06116e28361169e565b82815260059290921b840181019181810190888411156119cf57600080fd5b948201945b838610156119ed578535825294820194908201906119d4565b86525085810135935082841115611a0357600080fd5b611a0f8785880161162f565b818601525050505092915050565b80356001600160a01b03811681146115db57600080fd5b600080600060608486031215611a4957600080fd5b83356001600160401b03811115611a5f57600080fd5b611a6b86828701611959565b9350506020840135611a7c816115fd565b9150611a8a60408501611a1d565b90509250925092565b600082601f830112611aa457600080fd5b81356020611ab46116e28361169e565b82815260059290921b84018101918181019086841115611ad357600080fd5b8286015b8481101561176b5780356001600160401b03811115611af65760008081fd5b611b048986838b0101611959565b845250918301918301611ad7565b60008060008060808587031215611b2857600080fd5b84356001600160401b03811115611b3e57600080fd5b611b4a87828801611a93565b9450506020850135611b5b816115e0565b92506040850135611b6b816115fd565b9150611b7960608601611a1d565b905092959194509250565b600060208284031215611b9657600080fd5b81356001600160401b03811115611bac57600080fd5b61193884828501611a93565b60006020808301818452808551808352604092508286019150828160051b8701018488016000805b84811015611c5957898403603f19018652825180518886528051898701819052908a0190849060608801905b80831015611c2c5783518252928c019260019290920191908c0190611c0c565b50928b0151878403888d015292611c4381856118be565b998c019997505050938901935050600101611be0565b50919998505050505050505050565b600060208284031215611c7a57600080fd5b81356001600160401b03811115611c9057600080fd5b61193884828501611959565b600081518084526020808501945080840160005b83811015611cf557815180518852838101518489015260408082015160ff908116918a0191909152606091820151169088015260809096019590820190600101611cb0565b509495945050505050565b60208152611d1460208201835160ff169052565b60006020830151611d2d604084018263ffffffff169052565b50604083015163ffffffff8116606084015250606083015161ffff8116608084015250608083015160a083015260a0830151611d7460c08401826001600160401b03169052565b5060c083015160ff811660e08401525060e08301516101606101008181860152611da26101808601846118be565b90860151909250610120611dbd8682018363ffffffff169052565b80870151915050610140601f198685030181870152611ddc8483611c9c565b9601519190940152509192915050565b600080600060608486031215611e0157600080fd5b8351611e0c816115c1565b602085015160409095015190969495509392505050565b634e487b7160e01b600052603260045260246000fd5b600060208284031215611e4b57600080fd5b81516118fd816115e0565b634e487b7160e01b600052601160045260246000fd5b60ff828116828216039081111561128957611289611e56565b60008151611e9781856020860161189a565b9290920192915050565b600060ff60f81b808b60f81b16835263ffffffff60e01b8a60e01b166001840152808960f81b166005840152808860f81b166006840152866007840152856027840152808560f81b166047840152508251611f0381604885016020870161189a565b919091016048019998505050505050505050565b600060208284031215611f2957600080fd5b81516118fd816115fd565b600060208284031215611f4657600080fd5b5051919050565b6001600160e01b031960e089811b8216835288901b1660048201526001600160f01b031960f087901b166008820152600a81018590526001600160c01b031960c085901b16602a8201526001600160f81b031960f884901b1660328201528151600090611fc181603385016020870161189a565b9190910160330198975050505050505050565b60ff818116838216019081111561128957611289611e56565b600060018201611fff57611fff611e56565b5060010190565b60008551612018818460208a0161189a565b60f886901b6001600160f81b03191690830190815260e085901b6001600160e01b0319166001820152835161205481600584016020880161189a565b016005019695505050505050565b600060ff821660ff810361207857612078611e56565b60010192915050565b60008151602080840160005b83811015611cf55781518752958201959082019060010161208d565b60006118fd8284612081565b600060ff60f81b60f8818f821b16845263ffffffff60e01b8e60e01b166001850152818d821b166005850152818c821b1660068501528a60078501528960278501528189821b1660478501528188821b1660488501526121186049850188612081565b8287831b16815261212c6001820187611e85565b93505050509c9b505050505050505050505050565b8082018082111561128957611289611e56565b8181038181111561128957611289611e5656fea26469706673582212209c36aaba3701ab1a9f465747589d2d3afb38550afed69a1db02ddbb10068f1f964736f6c634300081300330000000000000000000000007109709ecfa91a80626ff3989d68f67f5b1dd12d";

type SigningWormholeSimulatorConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SigningWormholeSimulatorConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SigningWormholeSimulator__factory extends ContractFactory {
  constructor(...args: SigningWormholeSimulatorConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    wormhole_: PromiseOrValue<string>,
    devnetGuardian: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SigningWormholeSimulator> {
    return super.deploy(
      wormhole_,
      devnetGuardian,
      overrides || {}
    ) as Promise<SigningWormholeSimulator>;
  }
  override getDeployTransaction(
    wormhole_: PromiseOrValue<string>,
    devnetGuardian: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      wormhole_,
      devnetGuardian,
      overrides || {}
    );
  }
  override attach(address: string): SigningWormholeSimulator {
    return super.attach(address) as SigningWormholeSimulator;
  }
  override connect(signer: Signer): SigningWormholeSimulator__factory {
    return super.connect(signer) as SigningWormholeSimulator__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SigningWormholeSimulatorInterface {
    return new utils.Interface(_abi) as SigningWormholeSimulatorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SigningWormholeSimulator {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SigningWormholeSimulator;
  }
}