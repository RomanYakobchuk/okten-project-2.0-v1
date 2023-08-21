import mongoose from "mongoose";
import configs from "../configs";
import {CityForCount} from "./countByCity";

async function initDataBase() {
    try {
        await mongoose.connect(configs.MONGO_URL);
        const existingData = await CityForCount.find();

        if (existingData.length === 0) {
            const initialData = [
                {
                    name_ua: 'Вінниця',
                    name_en: 'Vinnytsia',
                    url: '',
                },
                {
                    name_ua: 'Дніпро',
                    name_en: 'Dnipro',
                    url: '',
                },
                {
                    name_ua: 'Донецьк',
                    name_en: 'Donetsk',
                    url: '',
                },
                {
                    name_ua: 'Житомир',
                    name_en: 'Zhytomyr',
                    url: '',
                },
                {
                    name_ua: 'Запоріжжя',
                    name_en: 'Zaporizhzhia',
                    url: '',
                },
                {
                    name_ua: 'Івано-Франківськ',
                    name_en: 'Ivano-Frankivsk',
                    url: '',
                },
                {
                    name_ua: 'Київ',
                    name_en: 'Kyiv',
                    url: '',
                },
                {
                    name_ua: 'Кропивницький',
                    name_en: 'Kropyvnytskyi',
                    url: '',
                },
                {
                    name_ua: 'Луганськ',
                    name_en: 'Luhansk',
                    url: '',
                },
                {
                    name_ua: 'Луцьк',
                    name_en: 'Lutsk',
                    url: '',
                },
                {
                    name_ua: 'Львів',
                    name_en: 'Lviv',
                    url: '',
                },
                {
                    name_ua: 'Миколаїв',
                    name_en: 'Mykolaiv',
                    url: '',
                },
                {
                    name_ua: 'Одеса',
                    name_en: 'Odesa',
                    url: '',
                },
                {
                    name_ua: 'Полтава',
                    name_en: 'Poltava',
                    url: '',
                },
                {
                    name_ua: 'Рівне',
                    name_en: 'Rivne',
                    url: '',
                },
                {
                    name_ua: 'Суми',
                    name_en: 'Sumy',
                    url: '',
                },
                {
                    name_ua: 'Тернопіль',
                    name_en: 'Ternopil',
                    url: '',
                },
                {
                    name_ua: 'Ужгород',
                    name_en: 'Uzhhorod',
                    url: '',
                },
                {
                    name_ua: 'Харків',
                    name_en: 'Kharkiv',
                    url: '',
                },
                {
                    name_ua: 'Херсон',
                    name_en: 'Kherson',
                    url: '',
                },
                {
                    name_ua: 'Хмельницький',
                    name_en: 'Khmelnytskyi',
                    url: '',
                },
                {
                    name_ua: 'Черкаси',
                    name_en: 'Cherkasy',
                    url: '',
                },
                {
                    name_ua: 'Чернівці',
                    name_en: 'Chernivtsi',
                    url: '',
                },
                {
                    name_ua: 'Чернігів',
                    name_en: 'Chernihiv',
                    url: '',
                },
            ];
            CityForCount.insertMany(initialData).then(() => {
                console.log('Initial Data added to CityForCount table')
            }).catch((error) => {
                console.error('Error added initialData: ', error)
            })
        } else {
            console.log('Data is exist')
        }
    } catch (e) {
        console.log('Init countByCity Error', e)
    } finally {
        await mongoose.connection.close();
    }
}

initDataBase();