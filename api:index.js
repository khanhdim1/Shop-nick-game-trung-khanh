const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Cấu hình
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: "trungkhanhshop",
    resave: false,
    saveUninitialized: true
}));

// Fake data acc game
const accounts = [
    { id: 1, game: "Đột Kích", price: 100000, info: "Rank cao, full vũ khí" },
    { id: 2, game: "Liên Quân", price: 50000, info: "Nhiều tướng, trang phục" },
    { id: 3, game: "Free Fire", price: 80000, info: "VIP skin + súng hiếm" }
];

// Trang chủ
app.get("/", (req, res) => {
    res.render("index", { user: req.session.user });
});

// Trang đăng nhập
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "123") {
        req.session.user = { username };
        res.redirect("/");
    } else {
        res.render("login", { error: "Sai tài khoản hoặc mật khẩu!" });
    }
});

// Trang danh sách acc
app.get("/shop", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("account", { accounts });
});

// Mua acc
app.get("/buy/:id", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    const acc = accounts.find(a => a.id == req.params.id);
    res.send(`Bạn đã mua thành công acc ${acc.game} - Giá: ${acc.price}đ`);
});

module.exports = app;
