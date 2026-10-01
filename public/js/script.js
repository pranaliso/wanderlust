// ======================================================
// WANDERLUST - MAIN JAVASCRIPT
// ======================================================



// ======================================================
// Bootstrap Form Validation
// ======================================================

(() => {
    "use strict";

    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach((form) => {

        form.addEventListener(
            "submit",
            (event) => {

                if (!form.checkValidity()) {

                    event.preventDefault();
                    event.stopPropagation();

                }

                form.classList.add("was-validated");

            },
            false
        );

    });

})();



// ======================================================
// Tax Toggle
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    const taxSwitch = document.getElementById("taxSwitch");

    // If the switch doesn't exist on this page, do nothing
    if (!taxSwitch) return;

    const prices = document.querySelectorAll(".listing-price");

    taxSwitch.addEventListener("change", () => {

        prices.forEach((priceElement) => {

            const originalPrice = Number(priceElement.dataset.price);

            if (isNaN(originalPrice)) return;

            if (taxSwitch.checked) {

                // Add 18% GST
                const totalPrice = Math.round(originalPrice * 1.18);

                priceElement.textContent =
                    `₹ ${totalPrice.toLocaleString("en-IN")}`;

            } else {

                priceElement.textContent =
                    `₹ ${originalPrice.toLocaleString("en-IN")}`;

            }

        });

    });

});