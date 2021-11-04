'use strict';

import {getReferenceCode, processReferralCode} from "../load.js";
import {Cookie} from "./cookie.js";

// =====================================================================================================================

const setReferralHandler = () => {
    setInterval(() => {
        Cookie.set('referral', getReferenceCode());
    }, 30000)
}

// =====================================================================================================================

const loadReferralCode = () => {
    let ref = Cookie.get("referral");
    if (ref)
        processReferralCode(ref);
}

// =====================================================================================================================

export {
    setReferralHandler,
    loadReferralCode
}
