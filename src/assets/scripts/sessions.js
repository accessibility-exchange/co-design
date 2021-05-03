/*
Copyright the Trivet copyright holders.

See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-project/trivet/raw/master/AUTHORS.md.

Licensed under the New BSD license. You may not use this file except in compliance with this License.

You may obtain a copy of the New BSD License at
https://github.com/fluid-project/trivet/raw/master/LICENSE.md.
*/

"use strict";

const { DateTime } = require("luxon");

const times = [...document.querySelectorAll("time")];

times.forEach(time => {
    const iso = DateTime.fromISO(time.getAttribute("datetime"));

    if (time.className === "dt-end") {
        if (iso.diffNow().toObject().milliseconds < 1) {
            time.closest(".h-event").hidden = true;
        }
    }

    const t = time.querySelector(".time");
    if (t) {
        t.textContent = iso.toFormat("t ZZZZ");
    } else {
        time.textContent = iso.toFormat("t ZZZZ");
    }
});
