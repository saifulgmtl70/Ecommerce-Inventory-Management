const dns = require("dns");
const tls = require("tls");

dns.setServers(["10.167.50.41"]);

const host = "ac-25bopin-shard-00-00.jip67yo.mongodb.net";

const socket = tls.connect({
    host: host,
    port: 27017,
    servername: host,
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.2"
}, () => {
    console.log("TLS 1.2 connection successful!");
    console.log("Protocol:", socket.getProtocol());
    console.log("Cipher:", socket.getCipher());
    socket.end();
});

socket.on("error", (err) => {
    console.error("TLS ERROR:", err);
});