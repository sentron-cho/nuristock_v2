import axios from "axios";
import * as cheerio from "cheerio";
import { FieldValues } from "../types/data.type";
import dayjs from "dayjs";

export const makeUpdateSet = (values?: FieldValues) => {
  if (!values) return "";

  const params = { utime: dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss"), ...values } as FieldValues;

  return Object.keys(params)
    .map((key) => `${key} = '${params[key]}'`)
    .join(", ");
};

export const makeInsertSet = (values?: FieldValues) => {
  if (!values) return "";

  const columns = Object.keys(values)
    .map((key) => `${key}`)
    .join(", ");

  const params = Object.keys(values)
    .map((key) => `'${values[key]}'`)
    .join(", ");

  return ` (${columns}, utime) VALUES (${params}, '${dayjs().tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}')`;
};

export const getNaverPrice = async (code: string) => {
  try {
    const url = `https://finance.naver.com/item/main.nhn?code=${code}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0", // 봇 차단 우회
      },
    });

    const $ = cheerio.load(data);
    const priceText = $(".no_today .blind").first().text();

    console.log({ url, priceText });

    return {
      code,
      price: Number(priceText.replace(/,/g, "")),
    };
  } catch (error) {
    throw new Error("크롤링 실패");
  }
};
