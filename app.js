const express = require("express");
const morgan = require("morgan");
const db = require("./db");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/select", (req, res) => {
  const { v } = req.body;

  try {
    const selectQuery = `
         select Z.payment
            from (
                         select age_gender,
                                payment,
                                count(id) OVER(partition by payment)
                           from history
                          where age_gender = "${v}"
                    )	Z
            group by Z.payment
            order by count(Z.payment) desc
            limit 1;
      `;

    db.query(selectQuery, (err, rows) => {
      if (err) {
        console.log(error);
        res.redirect("index");
      }

      if (rows.length === 0) {
        return res.render("next", { v });
      }

      return res.render("next", { v, rev: rows[0].payment });
    });
  } catch (error) {
    console.error(error);
    return res.redirect("index");
  }
});

app.post("/select2", (req, res) => {
  const { v, p } = req.body;

  try {
    const insertQuery = `
      insert into history (age_gender, payment, timeSep) values 
      ("${v}", "${p}", case 
                            when	DATE_FORMAT(NOW(), "%H%i%s") > 120000 then "오후"
                            else	"오전"
                       end
      )
      `;

    db.query(insertQuery, (error, results) => {
      if (error) {
        console.log(error);
        return res.redirect("index");
      }

      //성공
      return res.render("result", { resultValue: "분석된 값" });
    });
  } catch (error) {
    console.error(error);
    return res.render("index");
  }
});

app.listen(4000, () => {
  console.log("M/L Project Starting");
});
