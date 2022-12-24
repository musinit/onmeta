class onMetaWidget {
    constructor({
        apiKey,
        chainId,
        tokenAddress,
        elementId,
        walletAddress,
        fiatAmount,
        userEmail,
        offRamp,
        onRamp,
        fiatType,
        widgetHeight,
        minAmount,
        metamask,
    }) {
        this.apiKey = apiKey || "";
        this.elementId = elementId;
        this.walletAddress = walletAddress || "";
        this.fiatAmount = fiatAmount || "";
        this.chainId = chainId || "";
        this.tokenAddress = tokenAddress || "";
        this.isEventListnerOn = false;
        this.userEmail = userEmail || "";
        this.offRamp = offRamp || "";
        this.onRamp = onRamp || "";
        this.fiatType = fiatType || "inr";
        this.widgetHeight = widgetHeight || "34rem";
        this.minAmount = minAmount || "undefined";
        this.metamask = metamask || "";
    }
    init() {
        let iframe = document.createElement("iframe");
        iframe.id = "onMetaWidgetId";
        iframe.allow = "clipboard-read; clipboard-write;camera";

        const iframeCustomStyles = {
            border: "none",
            minHeight: this.widgetHeight,

            minWidth: "100%",
            overflow: "hidden",
        };
        Object.assign(iframe.style, iframeCustomStyles); // for adding the custom styles in the iframe

        if (!this.apiKey) {
            iframe.srcdoc = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Document</title> </head> <body> <div> <p>Invalid api key</p></div></body></html>`;
        } else {
            // iframe.src = `http://localhost:3000/?apiKey=${this.apiKey}&walletAddress=${this.walletAddress}&fiatAmount=${this.fiatAmount}&userEmail=${this.userEmail}&tokenAddress=${this.tokenAddress}&chainId=${this.chainId}&offRamp=${this.offRamp}&onRamp=${this.onRamp}&minAmount=${this.minAmount}&metamask=${this.metamask}&fiatType=${this.fiatType}`;
            // iframe.src = `https://stg.platform.onmeta.in/?apiKey=${this.apiKey}&walletAddress=${this.walletAddress}&fiatAmount=${this.fiatAmount}&userEmail=${this.userEmail}&tokenAddress=${this.tokenAddress}&chainId=${this.chainId}&offRamp=${this.offRamp}&onRamp=${this.onRamp}&minAmount=${this.minAmount}&metamask=${this.metamask}&fiatType=${this.fiatType}`;
            iframe.src = `https://platform.onmeta.in/?apiKey=${this.apiKey}&walletAddress=${this.walletAddress}&fiatAmount=${this.fiatAmount}&userEmail=${this.userEmail}&tokenAddress=${this.tokenAddress}&chainId=${this.chainId}&offRamp=${this.offRamp}&onRamp=${this.onRamp}&minAmount=${this.minAmount}&metamask=${this.metamask}&fiatType=${this.fiatType}`;
            // iframe.src = `https://test.platform.onmeta.in/?apiKey=${this.apiKey}&walletAddress=${this.walletAddress}&fiatAmount=${this.fiatAmount}&userEmail=${this.userEmail}&tokenAddress=${this.tokenAddress}&chainId=${this.chainId}&offRamp=${this.offRamp}&onRamp=${this.onRamp}&minAmount=${this.minAmount}&metamask=${this.metamask}&fiatType=${this.fiatType}`;
        }
        let element = document.getElementById(this.elementId);
        element.appendChild(iframe);
    }
    close() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        let iframe = document.getElementById("onMetaWidgetId");
        iframe && iframe.remove();
    }
    on(eventType, callbackFn) {
        // if (this.isEventListnerOn) return;
        window.addEventListener("message", function (event) {
            if (event.data.type === "onMetaHandler") {
                if (eventType === "ALL_EVENTS") {
                    if (
                        event.data.detail.cryptoSwap === "success" ||
                        event.data.detail.cryptoSwap === "failed"
                    ) {
                        callbackFn?.(event.data.detail.cryptoSwap);
                    }
                }
                if (
                    event.data.detail.cryptoSwap === "failed" &&
                    eventType === "FAILED"
                ) {
                    callbackFn?.(event.data.detail.cryptoSwap);
                }
                if (
                    event.data.detail.cryptoSwap === "success" &&
                    eventType === "SUCCESS"
                ) {
                    callbackFn?.(event.data.detail.cryptoSwap);
                }

                if (eventType === "ORDER_EVENTS") {
                    if (event.data.detail.eventCategory === "order") {
                        callbackFn?.(event.data.detail);
                    }
                }

                if (eventType === "ORDER_COMPLETED_EVENTS") {
                    if (
                        event.data.detail.eventCategory === "order" &&
                        event.data.detail.paymentType === "buy" &&
                        (event.data.detail.cryptoSwap === "success" ||
                            event.data.detail.cryptoSwap === "failed")
                    ) {
                        callbackFn?.(event.data.detail);
                    } else if (
                        event.data.detail.eventCategory === "order" &&
                        event.data.detail.paymentType === "sell" &&
                        (event.data.detail.paymentStatus === "success" ||
                            event.data.detail.paymentStatus === "failed")
                    ) {
                        callbackFn?.(event.data.detail);
                    }
                }

                if (eventType === "ACTION_EVENTS") {
                    if (event.data.detail.eventCategory === "action") {
                        callbackFn?.(event.data.detail);
                    }
                }
            }
        });
        // this.isEventListnerOn = true;
    }
}

window.onMetaWidget = onMetaWidget;
