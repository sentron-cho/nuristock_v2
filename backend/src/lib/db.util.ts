import axios from 'axios';
import * as cheerio from 'cheerio';

export const makeUpdateSet = (values?: Record<string, unknown>) => {
  if (!values) return "";

  return Object.keys(values)
    .map((key) => `${key} = '${values[key]}'`)
    .join(", ");
};

export const makeInsertSet = (values?: Record<string, unknown>) => {
  if (!values) return "";

  const columns = Object.keys(values)
    .map((key) => `${key}`)
    .join(", ");
  
  const params = Object.keys(values)
    .map((key) => `'${values[key]}'`)
    .join(", ");

  return ` (${columns}) VALUES (${params})`;
};

export const getNaverPrice = async (code: string) => {
  try {
    const url = `https://finance.naver.com/item/main.nhn?code=${code}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // 봇 차단 우회
      },
    });

    const $ = cheerio.load(data);
    const priceText = $('.no_today .blind').first().text();

    console.log({url, priceText});

    return {
      code,
      price: Number(priceText.replace(/,/g, '')),
    };
  } catch (error) {
    throw new Error('크롤링 실패');
  }
};