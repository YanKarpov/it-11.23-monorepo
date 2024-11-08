import bodyParser from "body-parser";
import express from "express";
import axios from "axios";

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/:quantity/news/for/:category", async (req, res) => {
	const { quantity, category } = req.params;

	try {
		// Получаем новости с указанного API
		const response = await axios.get("https://api.rss2json.com/v1/api.json?rss_url=https://www.vedomosti.ru/rss/rubric/business");
		const news = response.data.items; 
		const filteredNews = news
			.filter((item) => {
				return item.categories.some(cat => cat.includes(category)); 
			})
			.slice(0, Number.parseInt(quantity, 10)); 

		res.render("index", { news: filteredNews, quantity, category });
	} catch (error) {
		console.error("Ошибка при получении новостей:", error);
		res.status(500).send("Ошибка при получении новостей");
	}
});


app.listen(3000, () => {
	console.log("Сервер запущен на порту 3000");
});

export default app;
