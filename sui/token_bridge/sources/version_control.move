// SPDX-License-Identifier: Apache 2

/// This module implements dynamic field keys as empty structs. These keys with
/// `RequiredVersion` are used to determine minimum build requirements for
/// particular Wormhole methods and breaking backward compatibility for these
/// methods if an upgrade requires the latest upgrade version for its
/// functionality.
///
/// See `token_bridge::state` for more info.
module token_bridge::version_control {
    use wormhole::package_utils::{Self};

    ////////////////////////////////////////////////////////////////////////////
    //
    //  Hard-coded Version Control
    //
    //  Before upgrading, please set the types to match the latest version.
    //  `assert_current` is intended to be used for most paths through the
    //  `State` object.
    //
    ////////////////////////////////////////////////////////////////////////////

    /// Assert that the version hard-coded in this check is the current one.
    public(friend) fun assert_current(id: &UID) {
        // NOTE: This version should be the current build version. Please use
        // the struct at the top of this list of structs (where `V__DUMMY`
        // should be at the bottom).
        package_utils::assert_version<V__0_1_0>(id);
    }

    public(friend) fun assert_current_specified<Version>(id: &UID) {
        use std::type_name::{get};

        assert_current(id);
        assert!(get<V__0_1_0>() == get<Version>(), E_VERSION_MISMATCH);
    }

    /// Perform the official migration of one hard-coded version type to
    /// another.
    public(friend) fun update_to_current(id: &mut UID) {
        package_utils::update_version_type<V__DUMMY, V__0_1_0>(id, V__0_1_0 {});
    }

    ////////////////////////////////////////////////////////////////////////////
    //
    //  Change Log
    //
    //  Please write release notes as doc strings for each version struct. These
    //  notes will be our attempt at tracking upgrades. Wish us luck.
    //
    ////////////////////////////////////////////////////////////////////////////

    /// First published package.
    struct V__0_1_0 has store, drop, copy {}

    // Dummy.
    struct V__DUMMY has store, drop, copy {}

    ////////////////////////////////////////////////////////////////////////////
    //
    //  Implementation and Test-Only Methods
    //
    ////////////////////////////////////////////////////////////////////////////

    use sui::object::{UID};

    friend token_bridge::state;

    const E_VERSION_MISMATCH: u64 = 0;

    /// Only called once when `State` is created.
    public(friend) fun initialize(id: &mut UID) {
        package_utils::init_version(id, V__0_1_0 {});
    }

    #[test_only]
    public fun initialize_test_only(id: &mut UID) {
        initialize(id);
    }

    #[test_only]
    public fun update_test_only<Old: store + drop, New: store + drop>(
        id: &mut UID,
        new_version: New
    ) {
        package_utils::update_version_type<Old, New>(id, new_version);
    }

    #[test_only]
    public fun dummy(): V__DUMMY {
        V__DUMMY {}
    }

    #[test_only]
    public fun first(): V__0_1_0 {
        V__0_1_0 {}
    }

    #[test_only]
    struct V__MIGRATED has store, drop, copy {}

    #[test_only]
    public fun next_version(): V__MIGRATED {
        V__MIGRATED {}
    }

    #[test_only]
    public fun assert_current_test_only(id: &UID) {
        assert_current(id);
    }
}

#[test_only]
module token_bridge::version_control_tests {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self};
    use token_bridge::version_control::{Self, V__0_1_0, V__MIGRATED};

    struct State has key {
        id: UID
    }

    struct V_DUMMY has store, drop, copy {}

    #[test]
    fun test_assert_current() {
        // Create dummy state.
        let state = State { id: object::new(&mut tx_context::dummy()) };
        version_control::initialize_test_only(&mut state.id);

        version_control::assert_current_test_only(&state.id);

        // Clean up.
        let State { id } = state;
        object::delete(id);
    }

    #[test]
    #[expected_failure(abort_code = wormhole::package_utils::E_INCORRECT_OLD_VERSION)]
    fun test_cannot_update_incorrect_old_version() {
        // Create dummy state.
        let state = State { id: object::new(&mut tx_context::dummy()) };
        version_control::initialize_test_only(&mut state.id);

        version_control::assert_current_test_only(&state.id);

        // You shall not pass!
        version_control::update_test_only<V__MIGRATED, V__MIGRATED>(
            &mut state.id,
            version_control::next_version()
        );

        // Clean up.
        let State { id } = state;
        object::delete(id);
    }

    #[test]
    #[expected_failure(abort_code = wormhole::package_utils::E_SAME_VERSION)]
    fun test_cannot_update_same_version() {
        // Create dummy state.
        let state = State { id: object::new(&mut tx_context::dummy()) };
        version_control::initialize_test_only(&mut state.id);

        version_control::assert_current_test_only(&state.id);

        // You shall not pass!
        version_control::update_test_only<V__0_1_0, V__0_1_0>(
            &mut state.id,
            version_control::first()
        );

        // Clean up.
        let State { id } = state;
        object::delete(id);
    }

    #[test]
    #[expected_failure(abort_code = wormhole::package_utils::E_OUTDATED_VERSION)]
    fun test_cannot_assert_current_outdated_version() {
        // Create dummy state.
        let state = State { id: object::new(&mut tx_context::dummy()) };
        version_control::initialize_test_only(&mut state.id);

        version_control::assert_current_test_only(&state.id);

        // Valid update.
        version_control::update_test_only<V__0_1_0, V__MIGRATED>(
            &mut state.id,
            version_control::next_version()
        );

        // You shall not pass!
        version_control::assert_current_test_only(&state.id);

        // Clean up.
        let State { id } = state;
        object::delete(id);
    }

    #[test]
    #[expected_failure(abort_code = wormhole::package_utils::E_TYPE_NOT_ALLOWED)]
    fun test_cannot_update_type_not_allowed() {
        // Create dummy state.
        let state = State { id: object::new(&mut tx_context::dummy()) };
        version_control::initialize_test_only(&mut state.id);

        version_control::assert_current_test_only(&state.id);

        // You shall not pass!
        version_control::update_test_only<V__0_1_0, V_DUMMY>(
            &mut state.id,
            V_DUMMY {}
        );

        // Clean up.
        let State { id } = state;
        object::delete(id);
    }
}