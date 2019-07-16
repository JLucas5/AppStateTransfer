window.onfocus = function() {
    var url = new URL(window.location);
    var domain = url.hostname;
    if (domain.indexOf("www") == 0)
        domain = domain.slice(4, domain.length);

    window.postMessage({
        direction: "from-onfocus-script",
        message: domain
    }, "*");
};