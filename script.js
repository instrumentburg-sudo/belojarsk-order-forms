// Реальные данные из файла спецификации Karcher
// --- Supabase DataService (инициализация и базовые методы) ---
const SupabaseService = (() => {
    let client = null;
    let enabled = false;

    function init() {
        try {
            if (typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http') && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20 && window.supabase) {
                client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                enabled = true;
                console.log('[Supabase] Инициализирован клиент');
            } else {
                console.warn('[Supabase] Не настроен. Используется localStorage.');
            }
        } catch (e) {
            console.warn('[Supabase] Ошибка инициализации. Используется localStorage.', e);
        }
    }

    function isEnabled() { return enabled; }
    function getClient() { return client; }

    async function upsert(table, payload) {
        const { data, error } = await client.from(table).upsert(payload).select();
        if (error) throw error;
        return data;
    }

    async function insert(table, payload) {
        const { data, error } = await client.from(table).insert(payload).select();
        if (error) throw error;
        return data;
    }

    async function update(table, match, payload) {
        const { data, error } = await client.from(table).update(payload).match(match).select();
        if (error) throw error;
        return data;
    }

    async function remove(table, match) {
        const { error } = await client.from(table).delete().match(match);
        if (error) throw error;
        return true;
    }

    async function select(table, query = '*', filtersCb) {
        let req = client.from(table).select(query);
        if (typeof filtersCb === 'function') req = filtersCb(req);
        const { data, error } = await req;
        if (error) throw error;
        return data;
    }

    async function uploadToStorage(bucket, path, file) {
        const { data, error } = await client.storage.from(bucket).upload(path, file, { upsert: true });
        if (error) throw error;
        const { data: pub } = client.storage.from(bucket).getPublicUrl(path);
        return pub.publicUrl;
    }

    // Публичный API
    return { init, isEnabled, getClient, upsert, insert, update, remove, select, uploadToStorage };
})();

SupabaseService.init();
// Индикатор источника данных
function updateDataSourceIndicator() {
    const el = document.getElementById('dataSourceIndicator');
    if (!el) return;
    const isSb = SupabaseService.isEnabled();
    el.textContent = `Источник: ${isSb ? 'Supabase' : 'LocalStorage'}`;
    el.style.background = isSb ? '#e6fffa' : '#fff7ed';
    el.style.color = isSb ? '#065f46' : '#7c2d12';
    el.style.borderColor = isSb ? '#99f6e4' : '#fed7aa';
}

document.addEventListener('DOMContentLoaded', updateDataSourceIndicator);
const specificationData = {
    models: [
        { code: "MDL-001", name: "Поломойная машина Karcher BD 38/12" },
        { code: "MDL-002", name: "Поломоечная машина Karcher BR 30/4 C" },
        { code: "MDL-003", name: "Паропылесос Karcher SGV 8/5" },
        { code: "MDL-004", name: "Аппарат высокого давления Karcher K 5.20" },
        { code: "MDL-005", name: "Поломойная машина Karcher B 40 С Вр" },
        { code: "MDL-006", name: "Поломойная машина Karcher В 40 W Вр" },
        { code: "MDL-007", name: "Поломойная машина Karcher B 95 RS" },
        { code: "MDL-008", name: "Поломойная машина Karcher BD 75/120 R Classic Bp" },
        { code: "MDL-009", name: "Автоматическая портальная мойка Karcher ТВ 42" },
        { code: "MDL-010", name: "Аппарат высокого давления Karcher HD 10/21" },
        { code: "MDL-011", name: "Система очистки и фильтрации воды СОРВ 10" },
        { code: "MDL-012", name: "Аппарат высокого давления Karcher HD 6/16-4M" },
        { code: "MDL-013", name: "Аппарат высокого давления Karcher HD 6/13C" },
        { code: "MDL-014", name: "Аппарат высокого давления Karcher HD 5/15C" },
        { code: "MDL-015", name: "Аппарат высокого давления Karcher HD 5/12" },
        { code: "MDL-016", name: "Аппарат высокого давления Karcher К 7 Premium" },
        { code: "MDL-017", name: "Подметальная машина Karcher KM 70/20" },
        { code: "MDL-018", name: "Аппарат высокого давления Karcher HD 6/15M" },
        { code: "MDL-019", name: "Моющий пылесос Karcher PUZZI 10/1" },
        { code: "MDL-020", name: "Моющий пылесос Karcher SE3001" },
        { code: "MDL-021", name: "Пылесос Karcher Professional T 12/1" },
        { code: "MDL-022", name: "Пылесос Karcher T 15/1" },
        { code: "MDL-023", name: "Гладильная система Karcher SI 4 + Iron Kit*EU" },
        { code: "MDL-024", name: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition" },
        { code: "MDL-025", name: "Стеклоочиститель Karcher WVP10 Adv" },
        { code: "MDL-026", name: "Пароочиститель Karcher SC 2 Easyfix" },
        // Добавляем недостающие модели для материалов
        { code: "MDL-027", name: "Поломойная машина Karcher BD 50/50 C" },
        { code: "MDL-028", name: "Аппарат высокого давления Karcher HD 5/15 С" },
        { code: "MDL-029", name: "Поломойная машина Karcher B 40" }
    ],
    works: [
        // Техническое обслуживание
        { key: "Поломойная машина Karcher BD 38/12||Техническое обслуживание", model: "Поломойная машина Karcher BD 38/12", code: "WRK-001", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Поломоечная машина Karcher BR 30/4 C||Техническое обслуживание", model: "Поломоечная машина Karcher BR 30/4 C", code: "WRK-002", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Паропылесос Karcher SGV 8/5||Техническое обслуживание", model: "Паропылесос Karcher SGV 8/5", code: "WRK-003", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Аппарат высокого давления Karcher K 5.20||Техническое обслуживание", model: "Аппарат высокого давления Karcher K 5.20", code: "WRK-004", name: "Техническое обслуживание", unit: "раз", price: 4875.24 },
        { key: "Поломойная машина Karcher B 40 С Вр||Техническое обслуживание", model: "Поломойная машина Karcher B 40 С Вр", code: "WRK-005", name: "Техническое обслуживание", unit: "раз", price: 7541.16 },
        { key: "Поломойная машина Karcher В 40 W Вр||Техническое обслуживание", model: "Поломойная машина Karcher В 40 W Вр", code: "WRK-006", name: "Техническое обслуживание", unit: "раз", price: 7541.16 },
        { key: "Поломойная машина Karcher B 95 RS||Техническое обслуживание", model: "Поломойная машина Karcher B 95 RS", code: "WRK-007", name: "Техническое обслуживание", unit: "раз", price: 11311.68 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Техническое обслуживание", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "WRK-008", name: "Техническое обслуживание", unit: "раз", price: 11311.68 },
        { key: "Автоматическая портальная мойка Karcher ТВ 42||Техническое обслуживание", model: "Автоматическая портальная мойка Karcher ТВ 42", code: "WRK-009", name: "Техническое обслуживание", unit: "раз", price: 18852.84 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 10/21", code: "WRK-010", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Система очистки и фильтрации воды СОРВ 10||Техническое обслуживание", model: "Система очистки и фильтрации воды СОРВ 10", code: "WRK-011", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "WRK-012", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 6/13C", code: "WRK-013", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 5/15C", code: "WRK-014", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 5/12", code: "WRK-015", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Техническое обслуживание", model: "Аппарат высокого давления Karcher К 7 Premium", code: "WRK-016", name: "Техническое обслуживание", unit: "раз", price: 4875.24 },
        { key: "Подметальная машина Karcher KM 70/20||Техническое обслуживание", model: "Подметальная машина Karcher KM 70/20", code: "WRK-017", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 6/15M", code: "WRK-018", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Техническое обслуживание", model: "Моющий пылесос Karcher PUZZI 10/1", code: "WRK-019", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Моющий пылесос Karcher SE3001||Техническое обслуживание", model: "Моющий пылесос Karcher SE3001", code: "WRK-020", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Пылесос Karcher Professional T 12/1||Техническое обслуживание", model: "Пылесос Karcher Professional T 12/1", code: "WRK-021", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Пылесос Karcher T 15/1||Техническое обслуживание", model: "Пылесос Karcher T 15/1", code: "WRK-022", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Техническое обслуживание", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "WRK-023", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Техническое обслуживание", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "WRK-024", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Стеклоочиститель Karcher WVP10 Adv||Техническое обслуживание", model: "Стеклоочиститель Karcher WVP10 Adv", code: "WRK-025", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Техническое обслуживание", model: "Пароочиститель Karcher SC 2 Easyfix", code: "WRK-026", name: "Техническое обслуживание", unit: "раз", price: 3770.52 },
        
        // Техническое обслуживание для недостающих моделей
        { key: "Поломойная машина Karcher BD 50/50 C||Техническое обслуживание", model: "Поломойная машина Karcher BD 50/50 C", code: "WRK-027", name: "Техническое обслуживание", unit: "раз", price: 11311.68 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Техническое обслуживание", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "WRK-028", name: "Техническое обслуживание", unit: "раз", price: 8645.76 },
        { key: "Поломойная машина Karcher B 40||Техническое обслуживание", model: "Поломойная машина Karcher B 40", code: "WRK-029", name: "Техническое обслуживание", unit: "раз", price: 7541.16 },
        
        // Ремонт оборудования
        { key: "Все модели||Ремонт оборудования", model: "Все модели", code: "WRK-100", name: "Ремонт оборудования", unit: "н/ч", price: 3770.52 }
    ],
    materials: [
        // Запасные части для Karcher BD 50/50 C
        { key: "Поломойная машина Karcher BD 50/50 C||Переключатель 24V", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT001", name: "Переключатель 24V", unit: "шт", price: 2186.88 },
        { key: "Поломойная машина Karcher BD 50/50 C||Микропереключатель", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT002", name: "Микропереключатель", unit: "шт", price: 560.16 },
        { key: "Поломойная машина Karcher BD 50/50 C||Всасывающий шланг", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT003", name: "Всасывающий шланг", unit: "шт", price: 7020.96 },
        { key: "Поломойная машина Karcher BD 50/50 C||Сливной шланг", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT004", name: "Сливной шланг", unit: "шт", price: 8900.88 },
        { key: "Поломойная машина Karcher BD 50/50 C||Магнитный клапан 24V", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT005", name: "Магнитный клапан 24V", unit: "шт", price: 5716.56 },
        { key: "Поломойная машина Karcher BD 50/50 C||Набор углеродных щеток", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT006", name: "Набор углеродных щеток", unit: "шт", price: 1227.72 },
        { key: "Поломойная машина Karcher BD 50/50 C||Дисковая щетка в сборе красная D51", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT007", name: "Дисковая щетка в сборе красная D51", unit: "шт", price: 14195.40 },
        { key: "Поломойная машина Karcher BD 50/50 C||Уплотнительные полосы маслостойкие", model: "Поломойная машина Karcher BD 50/50 C", code: "PRT008", name: "Уплотнительные полосы маслостойкие", unit: "шт", price: 11893.44 },
        
        // Запасные части для Karcher HD 5/15 С
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Распределительный поршень в сборе", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT101", name: "Распределительный поршень в сборе", unit: "шт", price: 5793.24 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT102", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Сопловая насадка", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT103", name: "Сопловая насадка", unit: "шт", price: 2225.28 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Набор насосов HDC", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT104", name: "Набор насосов HDC", unit: "шт", price: 4066.80 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT105", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 5/15 С||Конденсатор 35MF", model: "Аппарат высокого давления Karcher HD 5/15 С", code: "PRT106", name: "Конденсатор 35MF", unit: "шт", price: 1266.12 },
        
        // Запасные части для Karcher KM 70/20
        { key: "Подметальная машина Karcher KM 70/20||Цилиндрическая щетка", model: "Подметальная машина Karcher KM 70/20", code: "PRT201", name: "Цилиндрическая щетка", unit: "шт", price: 12277.08 },
        { key: "Подметальная машина Karcher KM 70/20||Боковая щетка", model: "Подметальная машина Karcher KM 70/20", code: "PRT202", name: "Боковая щетка", unit: "шт", price: 6752.40 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук правый", model: "Подметальная машина Karcher KM 70/20", code: "PRT203", name: "Фартук правый", unit: "шт", price: 2186.88 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук левый", model: "Подметальная машина Karcher KM 70/20", code: "PRT204", name: "Фартук левый", unit: "шт", price: 2186.88 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук задний", model: "Подметальная машина Karcher KM 70/20", code: "PRT205", name: "Фартук задний", unit: "шт", price: 2762.40 },
        { key: "Подметальная машина Karcher KM 70/20||Картридж фильтра поролоновый", model: "Подметальная машина Karcher KM 70/20", code: "PRT206", name: "Картридж фильтра поролоновый", unit: "шт", price: 1841.52 },
        { key: "Подметальная машина Karcher KM 70/20||Ремень привода боковой щетки", model: "Подметальная машина Karcher KM 70/20", code: "PRT207", name: "Ремень привода боковой щетки", unit: "шт", price: 2724.00 },
        { key: "Подметальная машина Karcher KM 70/20||Цилиндрическая щетка для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT208", name: "Цилиндрическая щетка для Karcher KM 70/20", unit: "шт", price: 12277.08 },
        { key: "Подметальная машина Karcher KM 70/20||Боковая щетка для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT209", name: "Боковая щетка для Karcher KM 70/20", unit: "шт", price: 6752.40 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук правый для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT210", name: "Фартук правый для Karcher KM 70/20", unit: "шт", price: 2186.88 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук левый для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT211", name: "Фартук левый для Karcher KM 70/20", unit: "шт", price: 2186.88 },
        { key: "Подметальная машина Karcher KM 70/20||Фартук задний для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT212", name: "Фартук задний для Karcher KM 70/20", unit: "шт", price: 2762.40 },
        { key: "Подметальная машина Karcher KM 70/20||Картридж фильтра поролоновый для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT213", name: "Картридж фильтра поролоновый для Karcher KM 70/20", unit: "шт", price: 1841.52 },
        { key: "Подметальная машина Karcher KM 70/20||Ремень привода боковой щетки для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT214", name: "Ремень привода боковой щетки для Karcher KM 70/20", unit: "шт", price: 2724.00 },
        { key: "Подметальная машина Karcher KM 70/20||Поворотный ролик для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT215", name: "Поворотный ролик для Karcher KM 70/20", unit: "шт", price: 1150.92 },
        { key: "Подметальная машина Karcher KM 70/20||Кронштейн боковой щетки для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT216", name: "Кронштейн боковой щетки для Karcher KM 70/20", unit: "шт", price: 5217.72 },
        { key: "Подметальная машина Karcher KM 70/20||Фланец для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT217", name: "Фланец для Karcher KM 70/20", unit: "шт", price: 3146.04 },
        { key: "Подметальная машина Karcher KM 70/20||Шарикоподшипник для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT218", name: "Шарикоподшипник для Karcher KM 70/20", unit: "шт", price: 2378.64 },
        { key: "Подметальная машина Karcher KM 70/20||Металлический крепеж щетки для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT219", name: "Металлический крепеж щетки для Karcher KM 70/20", unit: "шт", price: 2071.80 },
        { key: "Подметальная машина Karcher KM 70/20||Барабанный шпиндель для Karcher KM 70/20", model: "Подметальная машина Karcher KM 70/20", code: "PRT220", name: "Барабанный шпиндель для Karcher KM 70/20", unit: "шт", price: 8824.20 },
        
        // Запасные части для Karcher BD 38/12
        { key: "Поломойная машина Karcher BD 38/12||Дисковая щетка красная BD 40/25", model: "Поломойная машина Karcher BD 38/12", code: "PRT301", name: "Дисковая щетка красная BD 40/25", unit: "шт", price: 12277.08 },
        { key: "Поломойная машина Karcher BD 38/12||Набор всасывающих насадок BD 38/12", model: "Поломойная машина Karcher BD 38/12", code: "PRT302", name: "Набор всасывающих насадок BD 38/12", unit: "шт", price: 9207.84 },
        { key: "Поломойная машина Karcher BD 38/12||Защитный профиль", model: "Поломойная машина Karcher BD 38/12", code: "PRT303", name: "Защитный профиль", unit: "шт", price: 6982.56 },
        { key: "Поломойная машина Karcher BD 38/12||Всасывающий шланг в компл. BD 38/12", model: "Поломойная машина Karcher BD 38/12", code: "PRT304", name: "Всасывающий шланг в компл. BD 38/12", unit: "шт", price: 6100.20 },
        
        // Запасные части для Karcher B 40 (из официальной спецификации)
        { key: "Поломойная машина Karcher B 40||Уплотнительное кольцо сетчатого фильтра для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT709", name: "Уплотнительное кольцо сетчатого фильтра для Karcher B 40", unit: "шт", price: 537.12, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Сливной фильтр для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT710", name: "Сливной фильтр для Karcher B 40", unit: "шт", price: 2263.56, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Уплотнение шарового клапана для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT711", name: "Уплотнение шарового клапана для Karcher B 40", unit: "шт", price: 230.16, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Сливной шланг с покрытием из ПУ для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT712", name: "Сливной шланг с покрытием из ПУ для Karcher B 40", unit: "шт", price: 8133.60, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Всасывающий шланг PU 50/32 для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT713", name: "Всасывающий шланг PU 50/32 для Karcher B 40", unit: "шт", price: 5217.72, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Стопорная шайба для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT714", name: "Стопорная шайба для Karcher B 40", unit: "шт", price: 283.92, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Направляющий ролик для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT715", name: "Направляющий ролик для Karcher B 40", unit: "шт", price: 5256.12, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Замена электромагнитного клапана 220-240 для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT716", name: "Замена электромагнитного клапана 220-240 для Karcher B 40", unit: "шт", price: 10358.76, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Выключатель для замены для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT717", name: "Выключатель для замены для Karcher B 40", unit: "шт", price: 5754.84, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Предохранитель электродвигателя 7 A для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT718", name: "Предохранитель электродвигателя 7 A для Karcher B 40", unit: "шт", price: 4642.32, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Конденсатор 30мF для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT719", name: "Конденсатор 30мF для Karcher B 40", unit: "шт", price: 1956.60, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Реле для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT720", name: "Реле для Karcher B 40", unit: "шт", price: 4757.40, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Поплавок для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT721", name: "Поплавок для Karcher B 40", unit: "шт", price: 2608.92, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Магнитный клапан 24 V для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT722", name: "Магнитный клапан 24 V для Karcher B 40", unit: "шт", price: 8363.76, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Всасывающая турбина для замены для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT723", name: "Всасывающая турбина для замены для Karcher B 40", unit: "шт", price: 16190.40, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Набор угольных щеток для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT724", name: "Набор угольных щеток для Karcher B 40", unit: "шт", price: 4143.48, maxQuantity: 5 },
        { key: "Поломойная машина Karcher B 40||Плата на замену С для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT725", name: "Плата на замену С для Karcher B 40", unit: "шт", price: 31153.20, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Переключатель выбора программ/замены для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT726", name: "Переключатель выбора программ/замены для Karcher B 40", unit: "шт", price: 4028.40, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Переключатель для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT727", name: "Переключатель для Karcher B 40", unit: "шт", price: 2110.08, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Силовое реле для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT728", name: "Силовое реле для Karcher B 40", unit: "шт", price: 9898.44, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Колесо привода для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT729", name: "Колесо привода для Karcher B 40", unit: "шт", price: 10051.92, maxQuantity: 2 },
        { key: "Поломойная машина Karcher B 40||Дисковая щетка в сборе красная D51 для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT730", name: "Дисковая щетка в сборе красная D51 для Karcher B 40", unit: "шт", price: 14195.40, maxQuantity: 10 },
        { key: "Поломойная машина Karcher B 40||Профиль защиты от брызг D51 для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT731", name: "Профиль защиты от брызг D51 для Karcher B 40", unit: "шт", price: 6100.20, maxQuantity: 3 },
        { key: "Поломойная машина Karcher B 40||Двигатель постоянного тока для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT732", name: "Двигатель постоянного тока для Karcher B 40", unit: "шт", price: 59237.04, maxQuantity: 1 },
        { key: "Поломойная машина Karcher B 40||Уплотнительные полосы маслостойкие,2 шт.870 мм для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT733", name: "Уплотнительные полосы маслостойкие,2 шт.870 мм для Karcher B 40", unit: "шт", price: 11893.44, maxQuantity: 10 },
        { key: "Поломойная машина Karcher B 40||Шарикоподшипник 6002-2RS для Karcher B 40", model: "Поломойная машина Karcher B 40", code: "PRT734", name: "Шарикоподшипник 6002-2RS для Karcher B 40", unit: "шт", price: 997.56, maxQuantity: 4 },
        
        // Запасные части для Karcher B 95 RS
        { key: "Поломойная машина Karcher B 95 RS||Щетка дисковая в сборе красная BD65", model: "Поломойная машина Karcher B 95 RS", code: "PRT501", name: "Щетка дисковая в сборе красная BD65", unit: "шт", price: 9591.48 },
        { key: "Поломойная машина Karcher B 95 RS||Уплотнительные полосы маслостойкие", model: "Поломойная машина Karcher B 95 RS", code: "PRT502", name: "Уплотнительные полосы маслостойкие", unit: "шт", price: 15576.60 },
        { key: "Поломойная машина Karcher B 95 RS||Мотор 600W", model: "Поломойная машина Karcher B 95 RS", code: "PRT503", name: "Мотор 600W", unit: "шт", price: 251450.40 },
        { key: "Поломойная машина Karcher B 95 RS||Всасывающая турбина", model: "Поломойная машина Karcher B 95 RS", code: "PRT504", name: "Всасывающая турбина", unit: "шт", price: 14267.76 },
        
        // Расходные материалы
        { key: "Система очистки и фильтрации воды СОРВ 10||Кварцевый песок фракция 2,0 (упаковка 25 кг)", model: "Система очистки и фильтрации воды СОРВ 10", code: "PRT601", name: "Кварцевый песок фракция 2,0 (упаковка 25 кг)", unit: "шт", price: 5102.64 },
        { key: "Система очистки и фильтрации воды СОРВ 10||Кварцевый песок фракция 0,5 (упаковка 25 кг)", model: "Система очистки и фильтрации воды СОРВ 10", code: "PRT602", name: "Кварцевый песок фракция 0,5 (упаковка 25 кг)", unit: "шт", price: 5102.64 },

        // Базовые материалы для моделей без специфических деталей
        { key: "Поломоечная машина Karcher BR 30/4 C||Масло гидравлическое", model: "Поломоечная машина Karcher BR 30/4 C", code: "PRT701", name: "Масло гидравлическое", unit: "л", price: 850.00 },
        { key: "Поломоечная машина Karcher BR 30/4 C||Фильтр воздушный", model: "Поломоечная машина Karcher BR 30/4 C", code: "PRT702", name: "Фильтр воздушный", unit: "шт", price: 1200.00 },
        
        { key: "Паропылесос Karcher SGV 8/5||Фильтр HEPA", model: "Паропылесос Karcher SGV 8/5", code: "PRT703", name: "Фильтр HEPA", unit: "шт", price: 2500.00 },
        { key: "Паропылесос Karcher SGV 8/5||Мешки для пыли (упаковка 5 шт)", model: "Паропылесос Karcher SGV 8/5", code: "PRT704", name: "Мешки для пыли (упаковка 5 шт)", unit: "упак", price: 450.00 },
        
        { key: "Аппарат высокого давления Karcher K 5.20||Шланг высокого давления", model: "Аппарат высокого давления Karcher K 5.20", code: "PRT705", name: "Шланг высокого давления", unit: "шт", price: 3500.00 },
        { key: "Аппарат высокого давления Karcher K 5.20||Пистолет-распылитель", model: "Аппарат высокого давления Karcher K 5.20", code: "PRT706", name: "Пистолет-распылитель", unit: "шт", price: 2800.00 },
        
        { key: "Поломойная машина Karcher B 40 С Вр||Щетка дисковая", model: "Поломойная машина Karcher B 40 С Вр", code: "PRT707", name: "Щетка дисковая", unit: "шт", price: 12000.00 },
        { key: "Поломойная машина Karcher B 40 С Вр||Всасывающий шланг", model: "Поломойная машина Karcher B 40 С Вр", code: "PRT708", name: "Всасывающий шланг", unit: "шт", price: 5500.00 },
        
        { key: "Поломойная машина Karcher В 40 W Вр||Щетка дисковая", model: "Поломойная машина Karcher В 40 W Вр", code: "PRT709W", name: "Щетка дисковая", unit: "шт", price: 12000.00 },
        { key: "Поломойная машина Karcher В 40 W Вр||Всасывающий шланг", model: "Поломойная машина Karcher В 40 W Вр", code: "PRT710W", name: "Всасывающий шланг", unit: "шт", price: 5500.00 },
        
        // Запасные части для Karcher K 7 Premium
        { key: "Аппарат высокого давления Karcher К 7 Premium||Шланг высокого давления 12/16MPa,60G", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT711K", name: "Шланг высокого давления 12/16MPa,60G", unit: "шт", price: 8670.72 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Щетка Power Brush WB 150", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT712K", name: "Щетка Power Brush WB 150", unit: "шт", price: 6023.40 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Цилиндрическая головка в сб. K7", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT713K", name: "Цилиндрическая головка в сб. K7", unit: "шт", price: 9898.44 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Направляющая поршня", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT714K", name: "Направляющая поршня", unit: "шт", price: 3261.12 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Наклонная шайба комплектный 11А28\"", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT715K", name: "Наклонная шайба комплектный 11А28\"", unit: "шт", price: 12814.20 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Струйная трубка Vario Power VP 180", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT716K", name: "Струйная трубка Vario Power VP 180", unit: "шт", price: 4872.48 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||КЗЧ электрической коробки", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT717K", name: "КЗЧ электрической коробки", unit: "шт", price: 5524.68 },
        { key: "Аппарат высокого давления Karcher К 7 Premium||Пенное сопло FJ 3", model: "Аппарат высокого давления Karcher К 7 Premium", code: "PRT718K", name: "Пенное сопло FJ 3", unit: "шт", price: 1381.20 },
        
        // Запасные части для Karcher BD 75/120 R Classic Bp
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Набор угольных щеток МК", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT801", name: "Набор угольных щеток МК", unit: "шт", price: 9821.64 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Комплект угольных щеток ATAS", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT802", name: "Комплект угольных щеток ATAS", unit: "шт", price: 13044.48 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Набор угольных щеток турбины", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT803", name: "Набор угольных щеток турбины", unit: "шт", price: 12967.68 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Пружина растяжения", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT804", name: "Пружина растяжения", unit: "шт", price: 10972.68 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Ручка выбора режимов", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT805", name: "Ручка выбора режимов", unit: "шт", price: 11502.12 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Ключ доступа KIK, желтый", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT806", name: "Ключ доступа KIK, желтый", unit: "шт", price: 8670.72 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Всасывающая турбина", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT807", name: "Всасывающая турбина", unit: "шт", price: 6023.40 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Сливной шланг", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT808", name: "Сливной шланг", unit: "шт", price: 9898.44 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Всасывающий шланг", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT809", name: "Всасывающий шланг", unit: "шт", price: 3261.12 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Дисковая щетка в сборе D41", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT810", name: "Дисковая щетка в сборе D41", unit: "шт", price: 12814.20 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Рулевая стойка для отводного прута", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT811", name: "Рулевая стойка для отводного прута", unit: "шт", price: 4872.48 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Набор резиновых губок PU 1030мм/40in", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT812", name: "Набор резиновых губок PU 1030мм/40in", unit: "шт", price: 5524.68 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Барашковый винт M8x30 VA", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT813", name: "Барашковый винт M8x30 VA", unit: "шт", price: 1381.20 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Дефлекторный ролик D125", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT814", name: "Дефлекторный ролик D125", unit: "шт", price: 20180.52 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Грибковая ручка M8X70 – VA", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT815", name: "Грибковая ручка M8X70 – VA", unit: "шт", price: 2532.12 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Брызговик", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT816", name: "Брызговик", unit: "шт", price: 3414.60 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Опорная рейка B90R", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT817", name: "Опорная рейка B90R", unit: "шт", price: 83561.04 },
        { key: "Поломойная машина Karcher BD 75/120 R Classic Bp||Насос чистой воды 3/4\"", model: "Поломойная машина Karcher BD 75/120 R Classic Bp", code: "PRT818", name: "Насос чистой воды 3/4\"", unit: "шт", price: 25168.08 },
        
        // Запасные части для Karcher HD 10/21
        { key: "Аппарат высокого давления Karcher HD 10/21||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT901", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Комплект колец круглого сечения", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT902", name: "Комплект колец круглого сечения", unit: "шт", price: 253.20 },
        { key: "Аппарат высокого давления Karcher HD 10/21||КЗЧ для распределительного золотника", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT903", name: "КЗЧ для распределительного золотника", unit: "шт", price: 7903.44 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Трансмиссионное масло (1 л)", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT904", name: "Трансмиссионное масло (1 л)", unit: "шт", price: 2071.80 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT905", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Комплект уплотнений TR", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT906", name: "Комплект уплотнений TR", unit: "шт", price: 844.08 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Мощное сопло TR 25052", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT907", name: "Мощное сопло TR 25052", unit: "шт", price: 2647.32 },
        { key: "Аппарат высокого давления Karcher HD 10/21||Автомат защиты электродвигателя", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT908", name: "Автомат защиты электродвигателя", unit: "шт", price: 5754.84 },
        { key: "Аппарат высокого давления Karcher HD 10/21||МК водяной фильтр", model: "Аппарат высокого давления Karcher HD 10/21", code: "PRT909", name: "МК водяной фильтр", unit: "шт", price: 3222.72 },
        
        // Запасные части для Karcher HD 6/15M
        { key: "Аппарат высокого давления Karcher HD 6/15M||Головка цилиндра", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1001", name: "Головка цилиндра", unit: "шт", price: 20180.52 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Манометр 0-30 МРа", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1002", name: "Манометр 0-30 МРа", unit: "шт", price: 2532.12 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Водяной фильтр", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1003", name: "Водяной фильтр", unit: "шт", price: 3414.60 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Электродвигатель в сборе", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1004", name: "Электродвигатель в сборе", unit: "шт", price: 83561.04 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Косая шайба", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1005", name: "Косая шайба", unit: "шт", price: 25168.08 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Кольцо с канавкой 12x20x4/6", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1006", name: "Кольцо с канавкой 12x20x4/6", unit: "шт", price: 590.88 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Комплект колец круглого сечения", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1007", name: "Комплект колец круглого сечения", unit: "шт", price: 253.20 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Перепускной узел в сборе", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1008", name: "Перепускной узел в сборе", unit: "шт", price: 4795.80 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Набор колец D14", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1009", name: "Набор колец D14", unit: "шт", price: 2455.44 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Пусковой клапан", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1010", name: "Пусковой клапан", unit: "шт", price: 2877.48 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Кольцо круглого сечения 4 x 2 -NBR90", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1011", name: "Кольцо круглого сечения 4 x 2 -NBR90", unit: "шт", price: 199.56 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Моторное масло (1 л)", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1012", name: "Моторное масло (1 л)", unit: "шт", price: 2071.80 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Микропереключатель K 7.200", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1013", name: "Микропереключатель K 7.200", unit: "шт", price: 1112.64 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Набор уплотнителей для насоса HD-M", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1014", name: "Набор уплотнителей для насоса HD-M", unit: "шт", price: 9975.12 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1015", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Комплект уплотнений TR", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1016", name: "Комплект уплотнений TR", unit: "шт", price: 844.08 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1017", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Жиклер полной мощности (замена 25033)", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1018", name: "Жиклер полной мощности (замена 25033)", unit: "шт", price: 2647.32 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Разбрызгиватель EASY!Force Advanced", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1019", name: "Разбрызгиватель EASY!Force Advanced", unit: "шт", price: 13044.48 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Струйная трубка TR 840 mm", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1020", name: "Струйная трубка TR 840 mm", unit: "шт", price: 12967.68 },
        { key: "Аппарат высокого давления Karcher HD 6/15M||Шланг в сборе TR DN6 30МПа 10m", model: "Аппарат высокого давления Karcher HD 6/15M", code: "PRT1021", name: "Шланг в сборе TR DN6 30МПа 10m", unit: "шт", price: 19029.48 },
        
        // Запасные части для Karcher HD 6/13C
        { key: "Аппарат высокого давления Karcher HD 6/13C||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1101", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Распределительный поршень в сборе", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1102", name: "Распределительный поршень в сборе", unit: "шт", price: 5793.24 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1103", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Сопловая насадка - только на замену", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1104", name: "Сопловая насадка - только на замену", unit: "шт", price: 2954.16 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Уплотнительное кольцо 60,0x2,0 -NBR70", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1105", name: "Уплотнительное кольцо 60,0x2,0 -NBR70", unit: "шт", price: 306.96 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Кольцо круглого сечения 21,95 х 1,78", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1106", name: "Кольцо круглого сечения 21,95 х 1,78", unit: "шт", price: 153.48 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Набор насосов HDC", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1107", name: "Набор насосов HDC", unit: "шт", price: 4066.80 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Комплект колец круглого сечения", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1108", name: "Комплект колец круглого сечения", unit: "шт", price: 253.20 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1109", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Кольцо круглого сечения 4 x 2 -NBR90", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1110", name: "Кольцо круглого сечения 4 x 2 -NBR90", unit: "шт", price: 199.56 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Кольцо круглого сечения 9,0 х 1,5", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1111", name: "Кольцо круглого сечения 9,0 х 1,5", unit: "шт", price: 153.48 },
        { key: "Аппарат высокого давления Karcher HD 6/13C||Конденсатор 35MF", model: "Аппарат высокого давления Karcher HD 6/13C", code: "PRT1112", name: "Конденсатор 35MF", unit: "шт", price: 1266.12 },
        
        // Запасные части для Karcher HD 6/16-4M
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1201", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Перепускной узел в сборе", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1202", name: "Перепускной узел в сборе", unit: "шт", price: 4795.80 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Золотник в сборе", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1203", name: "Золотник в сборе", unit: "шт", price: 2455.44 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Пусковой клапан", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1204", name: "Пусковой клапан", unit: "шт", price: 2877.48 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Кольцо круглого сечения 4 x 2 -NBR90", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1205", name: "Кольцо круглого сечения 4 x 2 -NBR90", unit: "шт", price: 199.56 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Микропереключатель K 7.200", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1206", name: "Микропереключатель K 7.200", unit: "шт", price: 1112.64 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1207", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Комплект уплотнений TR", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1208", name: "Комплект уплотнений TR", unit: "шт", price: 844.08 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1209", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Сопло TR 25043", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1210", name: "Сопло TR 25043", unit: "шт", price: 2647.32 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Резьбовая соединительная деталь", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1211", name: "Резьбовая соединительная деталь", unit: "шт", price: 920.76 },
        { key: "Аппарат высокого давления Karcher HD 6/16-4M||Гнездо клапана в сборе на замену HD6/13G", model: "Аппарат высокого давления Karcher HD 6/16-4M", code: "PRT1212", name: "Гнездо клапана в сборе на замену HD6/13G", unit: "шт", price: 1956.60 },
        
        // Запасные части для Karcher HD 5/15C
        { key: "Аппарат высокого давления Karcher HD 5/15C||Распределительный поршень в сборе", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1301", name: "Распределительный поршень в сборе", unit: "шт", price: 5793.24 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1302", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Сопловая насадка", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1303", name: "Сопловая насадка", unit: "шт", price: 2225.28 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Уплотнительное кольцо 60,0x2,0 -NBR70", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1304", name: "Уплотнительное кольцо 60,0x2,0 -NBR70", unit: "шт", price: 306.96 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Кольцо круглого сечения 21,95 х 1,78", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1305", name: "Кольцо круглого сечения 21,95 х 1,78", unit: "шт", price: 153.48 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Набор насосов HDC", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1306", name: "Набор насосов HDC", unit: "шт", price: 4066.80 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Комплект колец круглого сечения", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1307", name: "Комплект колец круглого сечения", unit: "шт", price: 253.20 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1308", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Кольцо круглого сечения 4 x 2 -NBR90", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1309", name: "Кольцо круглого сечения 4 x 2 -NBR90", unit: "шт", price: 199.56 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1310", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 5/15C||Конденсатор 35MF", model: "Аппарат высокого давления Karcher HD 5/15C", code: "PRT1311", name: "Конденсатор 35MF", unit: "шт", price: 1266.12 },
        
        // Запасные части для Karcher HD 5/12
        { key: "Аппарат высокого давления Karcher HD 5/12||Масло (канистра 1л)", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1401", name: "Масло (канистра 1л)", unit: "шт", price: 1150.92 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Распределительный поршень в сборе", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1402", name: "Распределительный поршень в сборе", unit: "шт", price: 5793.24 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Ось клапана в сборе", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1403", name: "Ось клапана в сборе", unit: "шт", price: 460.44 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Сопловая насадка", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1404", name: "Сопловая насадка", unit: "шт", price: 2225.28 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Уплотнительное кольцо 60,0x2,0 -NBR70", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1405", name: "Уплотнительное кольцо 60,0x2,0 -NBR70", unit: "шт", price: 306.96 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Кольцо круглого сечения 21,95 х 1,78", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1406", name: "Кольцо круглого сечения 21,95 х 1,78", unit: "шт", price: 153.48 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Набор насосов HDC", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1407", name: "Набор насосов HDC", unit: "шт", price: 4066.80 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Комплект колец круглого сечения", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1408", name: "Комплект колец круглого сечения", unit: "шт", price: 253.20 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Комплект уплотнителей", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1409", name: "Комплект уплотнителей", unit: "шт", price: 2378.64 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Кольцо круглого сечения 4 x 2 -NBR90", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1410", name: "Кольцо круглого сечения 4 x 2 -NBR90", unit: "шт", price: 199.56 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Грязевая фреза TR 035", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1411", name: "Грязевая фреза TR 035", unit: "шт", price: 9821.64 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Разбрызгиватель EASY!Force Advanced", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1412", name: "Разбрызгиватель EASY!Force Advanced", unit: "шт", price: 13044.48 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Струйная трубка TR 840 mm", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1413", name: "Струйная трубка TR 840 mm", unit: "шт", price: 12967.68 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Тройное TR сопло 035", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1414", name: "Тройное TR сопло 035", unit: "шт", price: 10972.68 },
        { key: "Аппарат высокого давления Karcher HD 5/12||Шланг TR DN6 25MPa 10m", model: "Аппарат высокого давления Karcher HD 5/12", code: "PRT1415", name: "Шланг TR DN6 25MPa 10m", unit: "шт", price: 11502.12 },
        
        // Запасные части для Karcher PUZZI 10/1
        { key: "Моющий пылесос Karcher PUZZI 10/1||Турбина корпуса", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1501", name: "Турбина корпуса", unit: "шт", price: 4719.00 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Насос с качающимся поршнем 230 В – GOTEC", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1502", name: "Насос с качающимся поршнем 230 В – GOTEC", unit: "шт", price: 18569.16 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Всасывающая турбина в сборе", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1503", name: "Всасывающая турбина в сборе", unit: "шт", price: 10972.68 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Плата", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1504", name: "Плата", unit: "шт", price: 1995.00 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Всасывающий шланг с подводкой воды, 2,5 м", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1505", name: "Всасывающий шланг с подводкой воды, 2,5 м", unit: "шт", price: 8977.68 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Всасывающий шланг с подводкой воды, 4,0 м", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1506", name: "Всасывающий шланг с подводкой воды, 4,0 м", unit: "шт", price: 14041.92 },
        { key: "Моющий пылесос Karcher PUZZI 10/1||Всасывающая балка 240 мм", model: "Моющий пылесос Karcher PUZZI 10/1", code: "PRT1507", name: "Всасывающая балка 240 мм", unit: "шт", price: 2455.44 },
        
        // Запасные части для Karcher SE3001
        { key: "Моющий пылесос Karcher SE3001||Удлинительная трубка SE4002 TUBO PROLUN", model: "Моющий пылесос Karcher SE3001", code: "PRT1601", name: "Удлинительная трубка SE4002 TUBO PROLUN", unit: "шт", price: 4373.76 },
        { key: "Моющий пылесос Karcher SE3001||Поворотный ролик D42", model: "Моющий пылесос Karcher SE3001", code: "PRT1602", name: "Поворотный ролик D42", unit: "шт", price: 391.32 },
        { key: "Моющий пылесос Karcher SE3001||Шланг в сборе SE", model: "Моющий пылесос Karcher SE3001", code: "PRT1603", name: "Шланг в сборе SE", unit: "шт", price: 28160.64 },
        { key: "Моющий пылесос Karcher SE3001||Клапан напорный", model: "Моющий пылесос Karcher SE3001", code: "PRT1604", name: "Клапан напорный", unit: "шт", price: 39056.52 },
        { key: "Моющий пылесос Karcher SE3001||Насосный комплект", model: "Моющий пылесос Karcher SE3001", code: "PRT1605", name: "Насосный комплект", unit: "шт", price: 9668.16 },
        { key: "Моющий пылесос Karcher SE3001||Микропереключатель", model: "Моющий пылесос Karcher SE3001", code: "PRT1606", name: "Микропереключатель", unit: "шт", price: 1726.44 },
        
        // Запасные части для Karcher Professional T 12/1
        { key: "Пылесос Karcher Professional T 12/1||Щеточная головка ESB 28", model: "Пылесос Karcher Professional T 12/1", code: "PRT1701", name: "Щеточная головка ESB 28", unit: "шт", price: 33608.52 },
        { key: "Пылесос Karcher Professional T 12/1||Фильтр-мешки флисовые (упаковка 10 шт.)", model: "Пылесос Karcher Professional T 12/1", code: "PRT1702", name: "Фильтр-мешки флисовые (упаковка 10 шт.)", unit: "шт", price: 3568.08 },
        { key: "Пылесос Karcher Professional T 12/1||Ходовой ролик с осью", model: "Пылесос Karcher Professional T 12/1", code: "PRT1703", name: "Ходовой ролик с осью", unit: "шт", price: 555.84 },
        { key: "Пылесос Karcher Professional T 12/1||Мотор комплектный", model: "Пылесос Karcher Professional T 12/1", code: "PRT1704", name: "Мотор комплектный", unit: "шт", price: 6637.32 },
        { key: "Пылесос Karcher Professional T 12/1||Верхняя часть щетки ESB 34", model: "Пылесос Karcher Professional T 12/1", code: "PRT1705", name: "Верхняя часть щетки ESB 34", unit: "шт", price: 45041.64 },
        { key: "Пылесос Karcher Professional T 12/1||Ходовой каток комплектный позади", model: "Пылесос Karcher Professional T 12/1", code: "PRT1706", name: "Ходовой каток комплектный позади", unit: "шт", price: 3568.08 },
        { key: "Пылесос Karcher Professional T 12/1||Валик щетки комплектный", model: "Пылесос Karcher Professional T 12/1", code: "PRT1707", name: "Валик щетки комплектный", unit: "шт", price: 7980.12 },
        { key: "Пылесос Karcher Professional T 12/1||Двигатель в сборе", model: "Пылесос Karcher Professional T 12/1", code: "PRT1708", name: "Двигатель в сборе", unit: "шт", price: 6215.28 },
        { key: "Пылесос Karcher Professional T 12/1||Телескопическая всасывающая трубка", model: "Пылесос Karcher Professional T 12/1", code: "PRT1709", name: "Телескопическая всасывающая трубка", unit: "шт", price: 17801.76 },
        { key: "Пылесос Karcher Professional T 12/1||Всасывающий шланг", model: "Пылесос Karcher Professional T 12/1", code: "PRT1710", name: "Всасывающий шланг", unit: "шт", price: 28237.32 },
        { key: "Пылесос Karcher Professional T 12/1||Всасывающая турбина в сборе", model: "Пылесос Karcher Professional T 12/1", code: "PRT1711", name: "Всасывающая турбина в сборе", unit: "шт", price: 6637.32 },
        { key: "Пылесос Karcher Professional T 12/1||Силовой кабель 12м PVC EU", model: "Пылесос Karcher Professional T 12/1", code: "PRT1712", name: "Силовой кабель 12м PVC EU", unit: "шт", price: 7673.16 },
        { key: "Пылесос Karcher Professional T 12/1||Кнопка", model: "Пылесос Karcher Professional T 12/1", code: "PRT1713", name: "Кнопка", unit: "шт", price: 1803.24 },
        
        // Запасные части для Karcher T 15/1
        { key: "Пылесос Karcher T 15/1||Силовой кабель 15m PUR *EU", model: "Пылесос Karcher T 15/1", code: "PRT1801", name: "Силовой кабель 15m PUR *EU", unit: "шт", price: 5831.64 },
        { key: "Пылесос Karcher T 15/1||Фильтр - мешки, тканевые (упаковка 10шт)", model: "Пылесос Karcher T 15/1", code: "PRT1802", name: "Фильтр - мешки, тканевые (упаковка 10шт)", unit: "шт", price: 4757.40 },
        { key: "Пылесос Karcher T 15/1||Кнопка", model: "Пылесос Karcher T 15/1", code: "PRT1803", name: "Кнопка", unit: "шт", price: 1803.24 },
        { key: "Пылесос Karcher T 15/1||Всасывающая турбина в сборе", model: "Пылесос Karcher T 15/1", code: "PRT1804", name: "Всасывающая турбина в сборе", unit: "шт", price: 6637.32 },
        { key: "Пылесос Karcher T 15/1||Щеточная головка ESB 28", model: "Пылесос Karcher T 15/1", code: "PRT1805", name: "Щеточная головка ESB 28", unit: "шт", price: 33608.52 },
        { key: "Пылесос Karcher T 15/1||Верхняя часть щетки ESB 34", model: "Пылесос Karcher T 15/1", code: "PRT1806", name: "Верхняя часть щетки ESB 34", unit: "шт", price: 45041.64 },
        { key: "Пылесос Karcher T 15/1||Ходовой ролик с осью", model: "Пылесос Karcher T 15/1", code: "PRT1807", name: "Ходовой ролик с осью", unit: "шт", price: 544.80 },
        { key: "Пылесос Karcher T 15/1||Мотор комплектный", model: "Пылесос Karcher T 15/1", code: "PRT1808", name: "Мотор комплектный", unit: "шт", price: 6637.32 },
        { key: "Пылесос Karcher T 15/1||Ходовой каток комплектный позади", model: "Пылесос Karcher T 15/1", code: "PRT1809", name: "Ходовой каток комплектный позади", unit: "шт", price: 3568.08 },
        { key: "Пылесос Karcher T 15/1||Валик щетки комплектный", model: "Пылесос Karcher T 15/1", code: "PRT1810", name: "Валик щетки комплектный", unit: "шт", price: 4757.40 },
        { key: "Пылесос Karcher T 15/1||Двигатель в сборе", model: "Пылесос Karcher T 15/1", code: "PRT1811", name: "Двигатель в сборе", unit: "шт", price: 6215.28 },
        { key: "Пылесос Karcher T 15/1||Телескопическая всасывающая трубка", model: "Пылесос Karcher T 15/1", code: "PRT1812", name: "Телескопическая всасывающая трубка", unit: "шт", price: 4757.40 },
        { key: "Пылесос Karcher T 15/1||Всасывающий шланг", model: "Пылесос Karcher T 15/1", code: "PRT1813", name: "Всасывающий шланг", unit: "шт", price: 5217.72 },
        
        // Запасные части для Karcher SI 4 + Iron Kit*EU
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Комплект проводов SC 4", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1901", name: "Комплект проводов SC 4", unit: "шт", price: 6905.88 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Кабель с вилкой EU 4m", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1902", name: "Кабель с вилкой EU 4m", unit: "шт", price: 1918.32 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Регулятор давления 3,2 bar", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1903", name: "Регулятор давления 3,2 bar", unit: "шт", price: 1879.92 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Насос в сборе MK", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1904", name: "Насос в сборе MK", unit: "шт", price: 5678.16 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Терморегулятор", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1905", name: "Терморегулятор", unit: "шт", price: 575.52 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Шланг 4x1,5", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1906", name: "Шланг 4x1,5", unit: "шт", price: 1342.80 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Паровой шланг в сборе для замены", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1907", name: "Паровой шланг в сборе для замены", unit: "шт", price: 3990.12 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Паровой утюг I 6006 желтый", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1908", name: "Паровой утюг I 6006 желтый", unit: "шт", price: 1611.36 },
        { key: "Гладильная система Karcher SI 4 + Iron Kit*EU||Удлинительная трубка", model: "Гладильная система Karcher SI 4 + Iron Kit*EU", code: "PRT1909", name: "Удлинительная трубка", unit: "шт", price: 1150.92 },
        
        // Запасные части для Karcher NT 30/1 Classic Edition
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Зажим фильтра", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2001", name: "Зажим фильтра", unit: "шт", price: 2877.48 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Фильтровальный патрон PES", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2002", name: "Фильтровальный патрон PES", unit: "шт", price: 1227.72 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Подвеска двигателя нижняя", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2003", name: "Подвеска двигателя нижняя", unit: "шт", price: 698.28 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Всасывающая турбина KING CLEAN", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2004", name: "Всасывающая турбина KING CLEAN", unit: "шт", price: 7634.88 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Подвеска двигателя верхняя", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2005", name: "Подвеска двигателя верхняя", unit: "шт", price: 4872.48 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Выключатель 240V", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2006", name: "Выключатель 240V", unit: "шт", price: 1150.92 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Двойная рулевая стойка", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2007", name: "Двойная рулевая стойка", unit: "шт", price: 5793.24 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Насадка для пола для замены", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2008", name: "Насадка для пола для замены", unit: "шт", price: 460.44 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Всасывающий шланг комплектный", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2009", name: "Всасывающий шланг комплектный", unit: "шт", price: 2225.28 },
        { key: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition||Сетевой шнур 6,5m *EU", model: "Пылесос влажной и сухой уборки Karcher NT 30/1 Classic Edition", code: "PRT2010", name: "Сетевой шнур 6,5m *EU", unit: "шт", price: 306.96 },
        
        // Запасные части для Karcher WVP10 Adv
        { key: "Стеклоочиститель Karcher WVP10 Adv||Стяжки узкие WV 50 (170мм)", model: "Стеклоочиститель Karcher WVP10 Adv", code: "PRT2101", name: "Стяжки узкие WV 50 (170мм)", unit: "шт", price: 153.48 },
        { key: "Стеклоочиститель Karcher WVP10 Adv||Подвод воды", model: "Стеклоочиститель Karcher WVP10 Adv", code: "PRT2102", name: "Подвод воды", unit: "шт", price: 4066.80 },
        { key: "Стеклоочиститель Karcher WVP10 Adv||Съемная кромочная полоса WV 50 (280мм)", model: "Стеклоочиститель Karcher WVP10 Adv", code: "PRT2103", name: "Съемная кромочная полоса WV 50 (280мм)", unit: "шт", price: 253.20 },
        { key: "Стеклоочиститель Karcher WVP10 Adv||Форсунка комплектный серый", model: "Стеклоочиститель Karcher WVP10 Adv", code: "PRT2104", name: "Форсунка комплектный серый", unit: "шт", price: 2378.64 },
        { key: "Стеклоочиститель Karcher WVP10 Adv||Сменный аккумулятор для WV 5", model: "Стеклоочиститель Karcher WVP10 Adv", code: "PRT2105", name: "Сменный аккумулятор для WV 5", unit: "шт", price: 199.56 },
        
        // Запасные части для Karcher SC 2 Easyfix
        { key: "Пароочиститель Karcher SC 2 Easyfix||Бойлер в сборе на замену SC 1.020", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2201", name: "Бойлер в сборе на замену SC 1.020", unit: "шт", price: 590.88 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Предохранитель в сборе на замену", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2202", name: "Предохранитель в сборе на замену", unit: "шт", price: 253.20 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Кабель со штекером 4 м", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2203", name: "Кабель со штекером 4 м", unit: "шт", price: 4795.80 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Уплотнитель SV 1202, 1402", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2204", name: "Уплотнитель SV 1202, 1402", unit: "шт", price: 2455.44 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Нипель", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2205", name: "Нипель", unit: "шт", price: 2877.48 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Термостат 143/260 ° C TR-TS Discomelt 2", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2206", name: "Термостат 143/260 ° C TR-TS Discomelt 2", unit: "шт", price: 199.56 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Сопло точечного разбрызгивания в компл.", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2207", name: "Сопло точечного разбрызгивания в компл.", unit: "шт", price: 2071.80 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Кольцо круглого сечения 7,65X1,78", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2208", name: "Кольцо круглого сечения 7,65X1,78", unit: "шт", price: 1112.64 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Кольцо круглого сечения 8,73 х 1,78", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2209", name: "Кольцо круглого сечения 8,73 х 1,78", unit: "шт", price: 9975.12 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Удлинительная трубка", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2210", name: "Удлинительная трубка", unit: "шт", price: 2378.64 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Уплотнительное кольцо EPDM 22x3", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2211", name: "Уплотнительное кольцо EPDM 22x3", unit: "шт", price: 844.08 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Шланг", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2212", name: "Шланг", unit: "шт", price: 460.44 },
        { key: "Пароочиститель Karcher SC 2 Easyfix||Комплект круглых щёток 4 шт.", model: "Пароочиститель Karcher SC 2 Easyfix", code: "PRT2213", name: "Комплект круглых щёток 4 шт.", unit: "шт", price: 2647.32 }
    ]
};

class OrderForm {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setCurrentDate();
        this.worksRows = [];
        this.materialsRows = [];
        this.loadModels();
        
        // Обновляем список контрагентов после инициализации ReferenceManager
        setTimeout(() => {
            if (referenceManager) {
                this.updateCustomerOptions();
            }
        }, 100);
    }

    initializeElements() {
        this.elements = {
            orderNumber: document.getElementById('orderNumber'),
            orderDate: document.getElementById('orderDate'),
            customerSelect: document.getElementById('customerSelect'),
            departmentSelect: document.getElementById('departmentSelect'),
            departmentGroup: document.getElementById('departmentGroup'),
            customerContact: document.getElementById('customerContact'),
            customerPhone: document.getElementById('customerPhone'),
            performerCompany: document.getElementById('performerCompany'),
            performerPhone: document.getElementById('performerPhone'),
            equipmentModel: document.getElementById('equipmentModel'),
            problemDescription: document.getElementById('problemDescription'),
            technicalConclusion: document.getElementById('technicalConclusion'),
            worksTableBody: document.getElementById('worksTableBody'),
            materialsTableBody: document.getElementById('materialsTableBody'),
            addWorkRow: document.getElementById('addWorkRow'),
            addMaterialRow: document.getElementById('addMaterialRow'),
            worksTotal: document.getElementById('worksTotal'),
            materialsTotal: document.getElementById('materialsTotal'),
            grandTotal: document.getElementById('grandTotal'),
            exportPdf: document.getElementById('exportPdf'),
            saveOrder: document.getElementById('saveOrder'),
            viewSavedOrders: document.getElementById('viewSavedOrders'),
            clearForm: document.getElementById('clearForm'),
            savedOrdersModal: document.getElementById('savedOrdersModal'),
            savedOrdersList: document.getElementById('savedOrdersList'),
            exportModal: document.getElementById('exportModal'),
            proceedExport: document.getElementById('proceedExport'),
            cancelExport: document.getElementById('cancelExport'),
            copyForAI: document.getElementById('copyForAI'),
            exportData: document.getElementById('exportData'),
            importData: document.getElementById('importData'),
            importDataText: document.getElementById('importDataText'),
            importFileInput: document.getElementById('importFileInput'),
            helpFaq: document.getElementById('helpFaq'),
            faqModal: document.getElementById('faqModal')
        };
        
        // Отладка - проверяем, что элементы найдены
        console.log('Elements found:', {
            exportData: !!this.elements.exportData,
            importData: !!this.elements.importData,
            importFileInput: !!this.elements.importFileInput
        });
        
        // Дополнительная диагностика для сервера
        console.log('Browser info:', {
            userAgent: navigator.userAgent,
            isHTTPS: location.protocol === 'https:',
            hasBlob: typeof Blob !== 'undefined',
            hasFileReader: typeof FileReader !== 'undefined',
            hasURL: typeof URL !== 'undefined' && typeof URL.createObjectURL !== 'undefined'
        });
    }

    setupEventListeners() {
        // Обработчик выбора заказчика
        this.elements.customerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'belojarskaya') {
                this.elements.departmentGroup.style.display = 'block';
                // Автозаполнение телефона для Белоярской АЭС
                this.elements.customerPhone.value = '+7 (34377) 2-21-02';
            } else {
                this.elements.departmentGroup.style.display = 'none';
                this.elements.departmentSelect.value = '';
                this.elements.customerPhone.value = '';
            }
        });

        // Автозаполнение телефонов ответственных по участкам
        this.elements.departmentSelect.addEventListener('change', (e) => {
            const departmentPhones = {
                'fish': '+7 (922) 106-00-36',         // Рыбный участок
                'sanatorium': '+7 (908) 634-46-20',   // Санаторно-курортный
                'motorsport': '+7 (922) 741-25-06',   // Автоспортивный участок
                'uud': '89090044856',                  // УУД АЭС (Седенкин Андрей Валерьевич)
                'auto': '+7 (961) 773-58-27'          // Авторемонтная служба (Новиков А.А.)
            };
            
            const departmentContacts = {
                'uud': 'Седенкин Андрей Валерьевич',   // УУД АЭС
                'auto': 'Новиков А.А.'                 // Авторемонтная служба
            };
            
            if (departmentPhones[e.target.value]) {
                this.elements.customerPhone.value = departmentPhones[e.target.value];
            } else if (this.elements.customerSelect.value === 'belojarskaya') {
                // Возвращаем основной телефон АЭС если участок не выбран
                this.elements.customerPhone.value = '+7 (34377) 2-21-02';
            }
            
            // Автозаполнение контактного лица
            if (departmentContacts[e.target.value]) {
                this.elements.customerContact.value = departmentContacts[e.target.value];
            } else if (e.target.value === '') {
                // Очищаем контактное лицо при сбросе участка
                this.elements.customerContact.value = '';
            }
        });

        this.elements.equipmentModel.addEventListener('change', () => this.onModelChange());
        this.elements.addWorkRow.addEventListener('click', () => this.addWorkRow());
        this.elements.addMaterialRow.addEventListener('click', () => this.addMaterialRow());
        this.elements.exportPdf.addEventListener('click', () => this.showExportModal());
        this.elements.saveOrder.addEventListener('click', () => this.saveOrder());
        this.elements.viewSavedOrders.addEventListener('click', () => this.showSavedOrders());
        this.elements.copyForAI.addEventListener('click', () => this.copyDataForAI());
        this.elements.exportData.addEventListener('click', () => {
            console.log('Export data button clicked');
            this.exportAllData();
        });
        this.elements.importData.addEventListener('click', () => {
            console.log('Import from file button clicked');
            this.showImportDialog();
        });
        this.elements.importDataText.addEventListener('click', () => {
            console.log('Import from text button clicked');
            this.showTextImportDialog();
        });
        this.elements.importFileInput.addEventListener('change', (e) => this.importAllData(e));
        this.elements.clearForm.addEventListener('click', () => this.clearForm());
        this.elements.helpFaq.addEventListener('click', () => this.showFaqModal());
        
        // Обработчики модального окна сохраненных заказов
        const closeBtn = this.elements.savedOrdersModal.querySelector('.close');
        closeBtn.addEventListener('click', () => this.hideSavedOrders());
        
        // Закрытие модального окна при клике вне его
        this.elements.savedOrdersModal.addEventListener('click', (e) => {
            if (e.target === this.elements.savedOrdersModal) {
                this.hideSavedOrders();
            }
        });

        // Обработчики модального окна экспорта
        const exportCloseBtn = this.elements.exportModal.querySelector('.close');
        exportCloseBtn.addEventListener('click', () => this.hideExportModal());
        this.elements.cancelExport.addEventListener('click', () => this.hideExportModal());
        this.elements.proceedExport.addEventListener('click', () => this.proceedWithExport());
        this.elements.exportModal.addEventListener('click', (e) => {
            if (e.target === this.elements.exportModal) {
                this.hideExportModal();
            }
        });

        // Обработчики модального окна FAQ
        const faqCloseBtn = this.elements.faqModal.querySelector('.close');
        faqCloseBtn.addEventListener('click', () => this.hideFaqModal());
        this.elements.faqModal.addEventListener('click', (e) => {
            if (e.target === this.elements.faqModal) {
                this.hideFaqModal();
            }
        });

        // Обработчики вкладок FAQ
        const faqTabs = document.querySelectorAll('.faq-tab-btn');
        faqTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchFaqTab(tab.dataset.tab));
        });


    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        this.elements.orderDate.value = today;
    }

    loadModels() {
        const select = this.elements.equipmentModel;
        select.innerHTML = '<option value="">Выберите модель</option>';
        
        const models = referenceManager ? referenceManager.getModels() : specificationData.models;
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = `${model.code} - ${model.name}`;
            select.appendChild(option);
        });
    }

    onModelChange() {
        const selectedModel = this.elements.equipmentModel.value;
        
        // Обновляем выпадающие списки работ и материалов
        this.updateWorkOptions(selectedModel);
        this.updateMaterialOptions(selectedModel);
        
        // Очищаем существующие строки
        this.clearWorksTable();
        this.clearMaterialsTable();
    }

    updateWorkOptions(selectedModel) {
        // Фильтруем работы: либо точное совпадение модели, либо "Все модели"
        const works = referenceManager ? referenceManager.getWorks() : specificationData.works;
        const filteredWorks = works.filter(work => 
            work.model === selectedModel || work.model === "Все модели"
        );
        this.availableWorks = filteredWorks;
    }

    updateMaterialOptions(selectedModel) {
        // Фильтруем материалы по выбранной модели
        const materials = referenceManager ? referenceManager.getMaterials() : specificationData.materials;
        const filteredMaterials = materials.filter(material => 
            material.model === selectedModel
        );
        this.availableMaterials = filteredMaterials;
    }

    updateCustomerOptions() {
        const select = this.elements.customerSelect;
        const currentValue = select.value;
        
        // Очищаем все опции кроме первой
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        const customers = referenceManager ? referenceManager.getCustomers() : ["ООО \"Белоярская АЭС - Авто\""];
        customers.forEach(customer => {
            const option = document.createElement('option');
            // Правильно определяем значение для Белоярской АЭС
            const isBelojarskaya = customer.includes("Белоярская АЭС") || customer.includes("Белоярская АЭС - Авто");
            option.value = isBelojarskaya ? "belojarskaya" : customer.toLowerCase().replace(/\s+/g, '').replace(/[^a-zа-я0-9]/gi, '');
            option.textContent = customer;
            select.appendChild(option);
            
            // Отладочная информация
            console.log(`Добавлен контрагент: "${customer}", значение: "${option.value}", isBelojarskaya: ${isBelojarskaya}`);
        });
        
        // Восстанавливаем значение
        select.value = currentValue;
    }

    addWorkRow() {
        const row = document.createElement('tr');
        const rowIndex = this.worksRows.length + 1;
        
        row.innerHTML = `
            <td>${rowIndex}</td>
            <td>
                <select class="work-select" data-row="${rowIndex}">
                    <option value="">Выберите работу</option>
                    ${this.availableWorks ? this.availableWorks.map(work => 
                        `<option value="${work.key}">${work.code} - ${work.name}</option>`
                    ).join('') : ''}
                </select>
            </td>
            <td class="work-name"></td>
            <td class="work-unit"></td>
            <td><input type="number" class="quantity-input" min="0" step="0.01" value="1" data-row="${rowIndex}"></td>
            <td class="work-price"></td>
            <td class="sum-cell work-sum">0.00</td>
            <td><button type="button" class="delete-btn" data-row="${rowIndex}">Удалить</button></td>
        `;

        // Добавляем обработчик для кнопки удаления
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.deleteWorkRow(rowIndex));
        }

        this.elements.worksTableBody.appendChild(row);
        this.worksRows.push(row);

        // Добавляем обработчики событий
        const workSelect = row.querySelector('.work-select');
        const quantityInput = row.querySelector('.quantity-input');

        workSelect.addEventListener('change', () => this.onWorkSelect(rowIndex));
        quantityInput.addEventListener('input', () => this.calculateWorkSum(rowIndex));

        return row;
    }

    addMaterialRow() {
        const row = document.createElement('tr');
        const rowIndex = this.materialsRows.length + 1;
        
        row.innerHTML = `
            <td>${rowIndex}</td>
            <td>
                <select class="material-select" data-row="${rowIndex}">
                    <option value="">Выберите материал</option>
                    ${this.availableMaterials ? this.availableMaterials.map(material => 
                        `<option value="${material.key}">${material.code} - ${material.name}</option>`
                    ).join('') : ''}
                </select>
            </td>
            <td class="material-name"></td>
            <td class="material-unit"></td>
            <td><input type="number" class="quantity-input" min="0" step="0.01" value="1" data-row="${rowIndex}"></td>
            <td class="material-price"></td>
            <td class="sum-cell material-sum">0.00</td>
            <td><button type="button" class="delete-btn" data-row="${rowIndex}">Удалить</button></td>
        `;

        // Добавляем обработчик для кнопки удаления
        const deleteBtnMaterial = row.querySelector('.delete-btn');
        if (deleteBtnMaterial) {
            deleteBtnMaterial.addEventListener('click', () => this.deleteMaterialRow(rowIndex));
        }

        this.elements.materialsTableBody.appendChild(row);
        this.materialsRows.push(row);

        // Добавляем обработчики событий
        const materialSelect = row.querySelector('.material-select');
        const quantityInput = row.querySelector('.quantity-input');

        materialSelect.addEventListener('change', () => this.onMaterialSelect(rowIndex));
        quantityInput.addEventListener('input', () => this.calculateMaterialSum(rowIndex));

        return row;
    }

    onWorkSelect(rowIndex) {
        const row = this.worksRows[rowIndex - 1];
        const select = row.querySelector('.work-select');
        const selectedKey = select.value;
        
        if (selectedKey) {
            const work = specificationData.works.find(w => w.key === selectedKey);
            if (work) {
                row.querySelector('.work-name').textContent = work.name;
                row.querySelector('.work-unit').textContent = work.unit;
                row.querySelector('.work-price').textContent = work.price.toFixed(2);
                this.calculateWorkSum(rowIndex);
            }
        } else {
            row.querySelector('.work-name').textContent = '';
            row.querySelector('.work-unit').textContent = '';
            row.querySelector('.work-price').textContent = '';
            row.querySelector('.work-sum').textContent = '0.00';
        }
        
        this.calculateTotals();
    }

    onMaterialSelect(rowIndex) {
        const row = this.materialsRows[rowIndex - 1];
        const select = row.querySelector('.material-select');
        const selectedKey = select.value;
        const quantityInput = row.querySelector('.quantity-input');
        
        if (selectedKey) {
            const material = specificationData.materials.find(m => m.key === selectedKey);
            if (material) {
                row.querySelector('.material-name').textContent = material.name;
                row.querySelector('.material-unit').textContent = material.unit;
                row.querySelector('.material-price').textContent = material.price.toFixed(2);
                
                // Устанавливаем максимальное количество, если оно определено
                if (material.maxQuantity) {
                    quantityInput.max = material.maxQuantity;
                    quantityInput.title = `Максимально допустимое количество: ${material.maxQuantity}`;
                    
                    // Если текущее значение превышает максимум, устанавливаем максимум
                    if (parseFloat(quantityInput.value) > material.maxQuantity) {
                        quantityInput.value = material.maxQuantity;
                    }
                } else {
                    quantityInput.removeAttribute('max');
                    quantityInput.title = '';
                }
                
                this.calculateMaterialSum(rowIndex);
            }
        } else {
            row.querySelector('.material-name').textContent = '';
            row.querySelector('.material-unit').textContent = '';
            row.querySelector('.material-price').textContent = '';
            row.querySelector('.material-sum').textContent = '0.00';
            quantityInput.removeAttribute('max');
            quantityInput.title = '';
        }
        
        this.calculateTotals();
    }

    calculateWorkSum(rowIndex) {
        const row = this.worksRows[rowIndex - 1];
        const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
        const price = parseFloat(row.querySelector('.work-price').textContent) || 0;
        const sum = quantity * price;
        
        row.querySelector('.work-sum').textContent = sum.toFixed(2);
        this.calculateTotals();
    }

    calculateMaterialSum(rowIndex) {
        const row = this.materialsRows[rowIndex - 1];
        const quantityInput = row.querySelector('.quantity-input');
        let quantity = parseFloat(quantityInput.value) || 0;
        const price = parseFloat(row.querySelector('.material-price').textContent) || 0;
        
        // Проверяем максимальное количество
        const maxQuantity = parseFloat(quantityInput.max);
        if (!isNaN(maxQuantity) && quantity > maxQuantity) {
            quantity = maxQuantity;
            quantityInput.value = maxQuantity;
            
            // Показываем предупреждение пользователю
            quantityInput.style.borderColor = '#ff6b6b';
            setTimeout(() => {
                quantityInput.style.borderColor = '';
            }, 2000);
        }
        
        const sum = quantity * price;
        
        row.querySelector('.material-sum').textContent = sum.toFixed(2);
        this.calculateTotals();
    }

    calculateTotals() {
        let worksTotal = 0;
        let materialsTotal = 0;

        // Суммируем работы
        this.worksRows.forEach(row => {
            const sum = parseFloat(row.querySelector('.work-sum').textContent) || 0;
            worksTotal += sum;
        });

        // Суммируем материалы
        this.materialsRows.forEach(row => {
            const sum = parseFloat(row.querySelector('.material-sum').textContent) || 0;
            materialsTotal += sum;
        });

        const grandTotal = worksTotal + materialsTotal;

        this.elements.worksTotal.textContent = worksTotal.toFixed(2) + ' ₽';
        this.elements.materialsTotal.textContent = materialsTotal.toFixed(2) + ' ₽';
        this.elements.grandTotal.textContent = grandTotal.toFixed(2) + ' ₽';
    }

    deleteWorkRow(rowIndex) {
        const row = this.worksRows[rowIndex - 1];
        row.remove();
        this.worksRows.splice(rowIndex - 1, 1);
        this.renumberWorks();
        this.calculateTotals();
    }

    deleteMaterialRow(rowIndex) {
        const row = this.materialsRows[rowIndex - 1];
        row.remove();
        this.materialsRows.splice(rowIndex - 1, 1);
        this.renumberMaterials();
        this.calculateTotals();
    }

    renumberWorks() {
        this.worksRows.forEach((row, index) => {
            row.querySelector('td:first-child').textContent = index + 1;
            row.querySelector('.work-select').dataset.row = index + 1;
            row.querySelector('.quantity-input').dataset.row = index + 1;
        });
    }

    renumberMaterials() {
        this.materialsRows.forEach((row, index) => {
            row.querySelector('td:first-child').textContent = index + 1;
            row.querySelector('.material-select').dataset.row = index + 1;
            row.querySelector('.quantity-input').dataset.row = index + 1;
        });
    }

    clearWorksTable() {
        this.elements.worksTableBody.innerHTML = '';
        this.worksRows = [];
    }

    clearMaterialsTable() {
        this.elements.materialsTableBody.innerHTML = '';
        this.materialsRows = [];
    }

    exportToPdf(withSignatures = false) {
        try {
            // Сначала пытаемся серверный экспорт, если не получается - клиентский
            if (this.tryServerPdfExport) {
                this.tryServerPdfExport(withSignatures);
                return;
            }
            
            // Создаем новое окно для печати
            const printWindow = window.open('', '_blank');
            const data = this.getFormData();
            
            // Генерируем HTML для печати
            const printContent = this.generatePrintableHTML(data, withSignatures);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Заказ-наряд № ${data.orderNumber || 'новый'}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            font-size: 12px;
                            line-height: 1.4;
                            margin: 20px;
                            color: #000;
                        }
                        
                        h1 {
                            text-align: center;
                            margin-bottom: 20px;
                            font-size: 18px;
                        }
                        
                        .order-info {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 15px;
                        }
                        
                        .section {
                            margin-bottom: 15px;
                        }
                        
                        .section h3 {
                            margin-bottom: 5px;
                            color: #333;
                            font-size: 14px;
                        }
                        
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 15px;
                        }
                        
                        th, td {
                            border: 1px solid #000;
                            padding: 5px;
                            text-align: left;
                            font-size: 11px;
                        }
                        
                        th {
                            background-color: #f0f0f0;
                            font-weight: bold;
                            text-align: center;
                        }
                        
                        .number-col { text-align: center; }
                        .price-col { text-align: right; }
                        
                        .totals {
                            margin-top: 20px;
                            padding: 10px;
                            background-color: #f9f9f9;
                            border: 1px solid #ddd;
                        }
                        
                        .signatures {
                            margin-top: 40px;
                            display: flex;
                            justify-content: space-between;
                            min-height: 280px;
                            overflow: visible;
                        }
                        
                        .signature {
                            width: 45%;
                            position: relative;
                            overflow: visible;
                        }
                        
                        .signature-line {
                            border-bottom: 1px solid #000;
                            margin-bottom: 5px;
                            height: 20px;
                        }
                        
                        .signature-text {
                            font-size: 10px;
                            text-align: center;
                        }
                        
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <div class="no-print" style="text-align: center; margin-top: 20px;">
                        <button id="printBtn" style="padding: 10px 20px; font-size: 14px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Печать / Сохранить как PDF</button>
                        <button id="closeBtn" style="padding: 10px 20px; font-size: 14px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Закрыть</button>
                        <script>
                            document.getElementById('printBtn').addEventListener('click', () => window.print());
                            document.getElementById('closeBtn').addEventListener('click', () => window.close());
                        </script>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            // Автоматически открываем диалог печати через небольшую задержку
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 500);
            
        } catch (error) {
            console.error('Ошибка при экспорте PDF:', error);
            alert('Ошибка при создании документа для печати');
        }
    }

    // Попытка серверного экспорта PDF (опционально)
    async tryServerPdfExport(withSignatures = false) {
        try {
            const data = this.getFormData();
            
            const response = await fetch('/export-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    withSignatures: withSignatures
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Заказ-наряд-${data.orderNumber || 'новый'}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                return;
            }
        } catch (error) {
            console.log('Серверный PDF недоступен, используем клиентский экспорт');
        }
        
        // Если серверный экспорт не сработал, удаляем ссылку на метод и используем клиентский
        this.tryServerPdfExport = null;
        this.exportToPdf(withSignatures);
    }

    generatePrintableHTML(data, withSignatures = false) {
        const worksTotal = data.worksTotal || data.works.reduce((sum, work) => sum + work.sum, 0);
        const materialsTotal = data.materialsTotal || data.materials.reduce((sum, material) => sum + material.sum, 0);
        const grandTotal = data.grandTotal || (worksTotal + materialsTotal);

        return `
            <h1>ЗАКАЗ-НАРЯД</h1>
            
            <div class="order-info">
                <div><strong>№ заказа:</strong> ${data.orderNumber || ''}</div>
                <div><strong>Дата:</strong> ${data.orderDate || ''}</div>
            </div>

            <div class="section">
                <h3>Заказчик</h3>
                <div><strong>Организация:</strong> ${data.customerOrganization || ''}</div>
                ${data.customerDepartment ? `<div><strong>Участок:</strong> ${data.customerDepartment}</div>` : ''}
                <div><strong>Контактное лицо:</strong> ${data.customerContact || ''}</div>
                <div><strong>Телефон:</strong> ${data.customerPhone || ''}</div>
            </div>

            <div class="section">
                <h3>Исполнитель работ</h3>
                <div><strong>Организация:</strong> ${data.performerCompany || 'ООО "ИнструментБург"'}</div>
                <div><strong>Телефон:</strong> ${data.performerPhone || '89505559684'}</div>
            </div>

            <div class="section">
                <h3>Техника</h3>
                <div><strong>Модель:</strong> ${data.equipmentModel || ''}</div>
                <div><strong>Неисправность:</strong> ${data.problemDescription || ''}</div>
            </div>

            ${data.works.length > 0 ? `
                <div class="section">
                    <h3>Выполняемые работы</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 30px;">№</th>
                                <th style="width: 80px;">Код</th>
                                <th>Наименование</th>
                                <th style="width: 60px;">Ед.изм.</th>
                                <th style="width: 60px;">Кол-во</th>
                                <th style="width: 80px;">Цена</th>
                                <th style="width: 80px;">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.works.map((work, index) => `
                                <tr>
                                    <td class="number-col">${index + 1}</td>
                                    <td class="number-col">${work.code}</td>
                                    <td>${work.name}</td>
                                    <td class="number-col">${work.unit}</td>
                                    <td class="number-col">${work.quantity}</td>
                                    <td class="price-col">${work.price.toFixed(2)}</td>
                                    <td class="price-col">${work.sum.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            ${data.materials.length > 0 ? `
                <div class="section">
                    <h3>Материалы и запчасти</h3>
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 30px;">№</th>
                                <th style="width: 80px;">Код</th>
                                <th>Наименование</th>
                                <th style="width: 60px;">Ед.изм.</th>
                                <th style="width: 60px;">Кол-во</th>
                                <th style="width: 80px;">Цена</th>
                                <th style="width: 80px;">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.materials.map((material, index) => `
                                <tr>
                                    <td class="number-col">${index + 1}</td>
                                    <td class="number-col">${material.code}</td>
                                    <td>${material.name}</td>
                                    <td class="number-col">${material.unit}</td>
                                    <td class="number-col">${material.quantity}</td>
                                    <td class="price-col">${material.price.toFixed(2)}</td>
                                    <td class="price-col">${material.sum.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}

            <div class="totals">
                <div style="margin-bottom: 5px;"><strong>Сумма работ:</strong> ${worksTotal.toFixed(2)} руб.</div>
                <div style="margin-bottom: 5px;"><strong>Сумма материалов:</strong> ${materialsTotal.toFixed(2)} руб.</div>
                <div style="font-size: 14px; font-weight: bold;"><strong>Общая сумма:</strong> ${grandTotal.toFixed(2)} руб.</div>
            </div>

            ${data.technicalConclusion ? `
                <div class="section" style="margin-top: 20px;">
                    <h3>Техническое заключение</h3>
                    <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap;">${data.technicalConclusion}</div>
                </div>
            ` : ''}

            <div class="signatures">
                <div class="signature">
                    <div><strong>Заказчик:</strong></div>
                    <div class="signature-line"></div>
                    <div class="signature-text">ФИО и подпись</div>
                </div>
                <div class="signature">
                    <div><strong>Исполнитель:</strong></div>
                    ${this.generateExecutorSignature(withSignatures)}
                </div>
            </div>
        `;
    }

    generateExecutorSignature(withSignatures) {
        if (!withSignatures) {
            return `
                <div class="signature-line"></div>
                <div class="signature-text">Дедков А.К.</div>
            `;
        }

        // Получаем изображения напрямую из localStorage
        const signatureImage = localStorage.getItem('signatureImage');
        const stampImage = localStorage.getItem('stampImage');
        
        console.log('Signature check:', {
            signatureExists: !!signatureImage,
            stampExists: !!stampImage,
            signatureLength: signatureImage ? signatureImage.length : 0,
            stampLength: stampImage ? stampImage.length : 0
        });

        if (!signatureImage && !stampImage) {
            return `
                <div class="signature-line" style="color: #666; font-style: italic;">
                    Подпись и печать не загружены. Загрузите в разделе "Управление справочниками" → "Подписи"
                </div>
                <div class="signature-text">Дедков А.К.</div>
            `;
        }

        return `
            <div class="signature-with-images" style="position: relative; min-height: 220px;">
                ${signatureImage ? `
                    <div class="signature-image" style="position: absolute; top: -35px; left: 50%; transform: translateX(-50%); z-index: 2;">
                        <img src="${signatureImage}" alt="Подпись Дедков А.К." style="height: 70px; width: auto; max-width: 180px;">
                    </div>
                ` : ''}
                <div class="signature-line" style="height: 20px; border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
                <div class="signature-text" style="text-align: center;">Дедков А.К.</div>
                ${stampImage ? `
                    <div class="stamp-image" style="position: absolute; top: 35px; left: 50%; transform: translateX(-50%); z-index: 1;">
                        <img src="${stampImage}" alt="Печать организации" style="width: 250px; height: 250px; object-fit: contain;">
                    </div>
                ` : ''}
            </div>
        `;
    }

    async saveOrder() {
        const data = this.getFormData();
        if (!data.orderNumber.trim()) {
            alert('Пожалуйста, укажите номер заказа перед сохранением');
            return;
        }

        data.savedAt = new Date().toISOString();

        // Подготовка для БД
        const workOrder = {
            order_number: data.orderNumber,
            customer_id: null,
            equipment_id: null,
            issue_description: data.problemDescription || '',
            status: 'draft',
            total_amount: Number(data.grandTotal || 0),
            created_at: new Date().toISOString()
        };

        const orderItems = [];
        (data.works || []).forEach(w => {
            orderItems.push({ item_id: null, item_type: 'service', quantity: Number(w.quantity||0), unit_price: Number(w.price||0), total_price: Number((w.quantity||0)*(w.price||0)) });
        });
        (data.materials || []).forEach(m => {
            orderItems.push({ item_id: null, item_type: 'material', quantity: Number(m.quantity||0), unit_price: Number(m.price||0), total_price: Number((m.quantity||0)*(m.price||0)) });
        });

        if (!SupabaseService.isEnabled()) {
            const saved = JSON.parse(localStorage.getItem('savedOrders') || '[]');
            const existingIndex = saved.findIndex(order => order.orderNumber === data.orderNumber);
            const payload = { ...data, id: Date.now() };
            if (existingIndex !== -1) {
                if (confirm(`Заказ с номером "${data.orderNumber}" уже существует. Обновить?`)) {
                    saved[existingIndex] = payload;
                    localStorage.setItem('savedOrders', JSON.stringify(saved));
                    alert('Заказ обновлен в локальном хранилище');
                }
            } else {
                saved.push(payload);
                localStorage.setItem('savedOrders', JSON.stringify(saved));
                alert(`Заказ "${data.orderNumber}" сохранен в локальном хранилище`);
            }
            return;
        }

        try {
            const existing = await SupabaseService.select('work_orders', '*', q => q.eq('order_number', workOrder.order_number).limit(1));
            let orderId;
            if (existing && existing.length > 0) {
                const updated = await SupabaseService.update('work_orders', { id: existing[0].id }, workOrder);
                orderId = updated[0].id;
                await SupabaseService.remove('order_items', { order_id: orderId });
            } else {
                const created = await SupabaseService.insert('work_orders', workOrder);
                orderId = created[0].id;
            }
            if (orderItems.length > 0) {
                const itemsToInsert = orderItems.map(i => ({ ...i, order_id: orderId }));
                await SupabaseService.insert('order_items', itemsToInsert);
            }
            alert('Заказ сохранен в Supabase');
        } catch (e) {
            console.error('Ошибка сохранения в Supabase', e);
            alert('Ошибка сохранения в Supabase. Используется localStorage.');
            const saved = JSON.parse(localStorage.getItem('savedOrders') || '[]');
            const existingIndex = saved.findIndex(order => order.orderNumber === data.orderNumber);
            const payload = { ...data, id: Date.now() };
            if (existingIndex !== -1) saved[existingIndex] = payload; else saved.push(payload);
            localStorage.setItem('savedOrders', JSON.stringify(saved));
        }
    }

    clearForm() {
        if (confirm('Вы уверены, что хотите очистить форму?')) {
            // Очистка основных полей
            this.elements.orderNumber.value = '';
            this.elements.customerSelect.value = '';
            this.elements.departmentSelect.value = '';
            this.elements.customerContact.value = '';
            this.elements.customerPhone.value = '';
            this.elements.equipmentModel.value = '';
            this.elements.problemDescription.value = '';
            this.elements.technicalConclusion.value = '';
            
            // Скрытие группы участков
            this.elements.departmentGroup.style.display = 'none';
            
            // Восстановление текущей даты
            this.setCurrentDate();
            
            // Очистка таблиц
            this.clearWorksTable();
            this.clearMaterialsTable();
            
            // Пересчет сумм
            this.calculateTotals();
            
            // Сброс состояния модели
            this.currentModel = null;
        }
    }

    getFormData() {
        const worksData = this.worksRows.map(row => ({
            code: row.querySelector('.work-select option:checked').textContent.split(' - ')[0] || '',
            name: row.querySelector('.work-name').textContent,
            unit: row.querySelector('.work-unit').textContent,
            quantity: parseFloat(row.querySelector('.quantity-input').value) || 0,
            price: parseFloat(row.querySelector('.work-price').textContent) || 0,
            sum: parseFloat(row.querySelector('.work-sum').textContent) || 0
        })).filter(work => work.name);

        const materialsData = this.materialsRows.map(row => ({
            code: row.querySelector('.material-select option:checked').textContent.split(' - ')[0] || '',
            name: row.querySelector('.material-name').textContent,
            unit: row.querySelector('.material-unit').textContent,
            quantity: parseFloat(row.querySelector('.quantity-input').value) || 0,
            price: parseFloat(row.querySelector('.material-price').textContent) || 0,
            sum: parseFloat(row.querySelector('.material-sum').textContent) || 0
        })).filter(material => material.name);

        // Получаем название организации и участка
        const customerSelectElement = this.elements.customerSelect;
        const departmentSelectElement = this.elements.departmentSelect;
        
        const customerOrganization = customerSelectElement.options[customerSelectElement.selectedIndex]?.text || '';
        const customerDepartment = departmentSelectElement.options[departmentSelectElement.selectedIndex]?.text || '';

        return {
            orderNumber: this.elements.orderNumber.value,
            orderDate: this.elements.orderDate.value,
            customerOrganization: customerOrganization,
            customerDepartment: customerDepartment !== 'Выберите участок' ? customerDepartment : '',
            customerContact: this.elements.customerContact.value,
            customerPhone: this.elements.customerPhone.value,
            performerCompany: this.elements.performerCompany.value,
            performerPhone: this.elements.performerPhone.value,
            equipmentModel: this.elements.equipmentModel.options[this.elements.equipmentModel.selectedIndex]?.text || '',
            problemDescription: this.elements.problemDescription.value,
            technicalConclusion: this.elements.technicalConclusion.value,
            works: worksData,
            materials: materialsData,
            worksTotal: parseFloat(this.elements.worksTotal.textContent) || 0,
            materialsTotal: parseFloat(this.elements.materialsTotal.textContent) || 0,
            grandTotal: parseFloat(this.elements.grandTotal.textContent) || 0
        };
    }

    async showSavedOrders() {
        let savedOrders = [];
        if (SupabaseService.isEnabled()) {
            try {
                const rows = await SupabaseService.select('work_orders', '*', q => q.order('created_at', { ascending: false }));
                savedOrders = rows.map(r => ({
                    id: r.id,
                    orderNumber: r.order_number,
                    department: '',
                    works: [],
                    materials: [],
                    grandTotal: r.total_amount || 0,
                    savedAt: r.created_at
                }));
            } catch (e) {
                console.error('Ошибка загрузки заказов из Supabase', e);
            }
        }
        if (!SupabaseService.isEnabled() || savedOrders.length === 0) {
            savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
        }

        if (savedOrders.length === 0) {
            this.elements.savedOrdersList.innerHTML = '<div class="no-orders">Нет сохраненных заказ-нарядов</div>';
        } else {
            // Группируем заказы по участкам
            const groupedOrders = this.groupOrdersByDepartment(savedOrders);
            
            let html = '';
            let grandTotalWorks = 0;
            let grandTotalMaterials = 0;
            let grandTotalOrders = 0;
            
            // Отображаем каждую группу
            Object.keys(groupedOrders).forEach(department => {
                const orders = groupedOrders[department];
                const departmentTotals = this.calculateDepartmentTotal(orders);
                
                // Добавляем к общей сумме
                grandTotalWorks += departmentTotals.works;
                grandTotalMaterials += departmentTotals.materials;
                grandTotalOrders += orders.length;
                
                html += `
                    <div class="department-group">
                        <div class="department-header">
                            <div class="department-info">
                                <h3>${this.getDepartmentDisplayName(department)}</h3>
                                <div class="department-stats">
                                    <span class="orders-count">${orders.length} заказов</span>
                                    <span class="total-amount">${this.formatCurrency(departmentTotals.total)}</span>
                                </div>
                            </div>
                            <div class="department-breakdown">
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Работы:</span>
                                    <span class="breakdown-value">${this.formatCurrency(departmentTotals.works)}</span>
                                </div>
                                <div class="breakdown-item">
                                    <span class="breakdown-label">Материалы:</span>
                                    <span class="breakdown-value">${this.formatCurrency(departmentTotals.materials)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="department-orders">
                            ${orders.map(order => this.renderSavedOrderItem(order)).join('')}
                        </div>
                    </div>
                `;
            });
            
            // Добавляем общую сумму по всем участкам
            const grandTotal = grandTotalWorks + grandTotalMaterials;
            html += `
                <div class="grand-total-section">
                    <div class="grand-total-header">
                        <h2>📊 Общая статистика по всем участкам</h2>
                    </div>
                    <div class="grand-total-content">
                        <div class="grand-total-stats">
                            <div class="stat-item">
                                <span class="stat-label">Всего заказов:</span>
                                <span class="stat-value">${grandTotalOrders}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Работы:</span>
                                <span class="stat-value">${this.formatCurrency(grandTotalWorks)}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Материалы:</span>
                                <span class="stat-value">${this.formatCurrency(grandTotalMaterials)}</span>
                            </div>
                            <div class="stat-item grand-total-item">
                                <span class="stat-label">Общая сумма:</span>
                                <span class="stat-value grand-total-value">${this.formatCurrency(grandTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.elements.savedOrdersList.innerHTML = html;
            
            // Добавляем обработчики для кнопок загрузки и удаления
            this.elements.savedOrdersList.querySelectorAll('.btn-load').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const orderId = parseInt(e.target.dataset.orderId);
                    await this.loadOrder(orderId);
                });
            });
            
            this.elements.savedOrdersList.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const orderId = parseInt(e.target.dataset.orderId);
                    await this.deleteOrder(orderId);
                });
            });
        }
        
        this.elements.savedOrdersModal.style.display = 'block';
    }

    hideSavedOrders() {
        this.elements.savedOrdersModal.style.display = 'none';
    }

    groupOrdersByDepartment(orders) {
        const groups = {};
        
        orders.forEach(order => {
            let departmentKey = 'other'; // По умолчанию для заказов без участка
            
            if (order.customerDepartment) {
                // Определяем ключ участка на основе названия
                if (order.customerDepartment.includes('Рыбный')) {
                    departmentKey = 'fish';
                } else if (order.customerDepartment.includes('Автоспортивный')) {
                    departmentKey = 'motorsport';
                } else if (order.customerDepartment.includes('Санаторно-курортный')) {
                    departmentKey = 'sanatorium';
                } else if (order.customerDepartment.includes('УУД АЭС')) {
                    departmentKey = 'uud';
                } else if (order.customerDepartment.includes('Авторемонтная')) {
                    departmentKey = 'auto';
                } else {
                    departmentKey = 'other';
                }
            } else if (order.customerOrganization && order.customerOrganization.includes('Белоярская АЭС')) {
                departmentKey = 'belojarskaya-general';
            }
            
            if (!groups[departmentKey]) {
                groups[departmentKey] = [];
            }
            
            groups[departmentKey].push(order);
        });
        
        // Сортируем заказы в каждой группе по дате сохранения (новые первыми)
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        });
        
        return groups;
    }

    getDepartmentDisplayName(departmentKey) {
        const departmentNames = {
            'fish': '🐟 Рыбный участок',
            'motorsport': '🏎️ Автоспортивный участок', 
            'sanatorium': '🏨 Санаторно-курортный отдел',
            'uud': '⚙️ УУД АЭС',
            'auto': '🔧 Авторемонтная служба',
            'belojarskaya-general': '🏭 Белоярская АЭС (общие)',
            'other': '📋 Другие организации'
        };
        
        return departmentNames[departmentKey] || '📋 Другие организации';
    }

    calculateDepartmentTotal(orders) {
        let worksTotal = 0;
        let materialsTotal = 0;
        
        orders.forEach(order => {
            if (order.works && Array.isArray(order.works)) {
                worksTotal += order.works.reduce((sum, work) => sum + (work.sum || 0), 0);
            }
            if (order.materials && Array.isArray(order.materials)) {
                materialsTotal += order.materials.reduce((sum, material) => sum + (material.sum || 0), 0);
            }
        });
        
        return {
            works: worksTotal,
            materials: materialsTotal,
            total: worksTotal + materialsTotal
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 2
        }).format(amount);
    }

    renderSavedOrderItem(order) {
        const savedDate = new Date(order.savedAt).toLocaleString('ru-RU');
        const worksTotal = order.works.reduce((sum, work) => sum + work.sum, 0);
        const materialsTotal = order.materials.reduce((sum, material) => sum + material.sum, 0);
        const grandTotal = worksTotal + materialsTotal;

        return `
            <div class="saved-order-item">
                <div class="saved-order-header">
                    <div class="saved-order-title">Заказ № ${order.orderNumber}</div>
                    <div class="saved-order-date">Сохранен: ${savedDate}</div>
                </div>
                <div class="saved-order-info">
                    <span><strong>Дата заказа:</strong> ${order.orderDate}</span>
                    <span><strong>Заказчик:</strong> ${order.customerOrganization}</span>
                    <span><strong>Модель:</strong> ${order.equipmentModel}</span>
                </div>
                <div class="saved-order-info">
                    <span><strong>Работ:</strong> ${order.works.length} шт.</span>
                    <span><strong>Материалов:</strong> ${order.materials.length} шт.</span>
                    <span><strong>Общая сумма:</strong> ${grandTotal.toFixed(2)} руб.</span>
                </div>
                <div class="saved-order-actions">
                    <button class="btn-small btn-load" data-order-id="${order.id}">Загрузить</button>
                    <button class="btn-small btn-delete" data-order-id="${order.id}">Удалить</button>
                </div>
            </div>
        `;
    }

    async loadOrder(orderId) {
        let order = null;
        let items = [];
        if (SupabaseService.isEnabled()) {
            try {
                const rows = await SupabaseService.select('work_orders', '*', q => q.eq('id', orderId).limit(1));
                if (rows && rows.length > 0) {
                    order = rows[0];
                    items = await SupabaseService.select('order_items', '*', q => q.eq('order_id', orderId));
                }
            } catch (e) {
                console.error('Ошибка загрузки заказа из Supabase', e);
            }
        }
        if (!order) {
            const savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
            order = savedOrders.find(o => o.id === orderId);
        }
        
        if (!order) {
            alert('Заказ не найден');
            return;
        }

        const orderNumber = order.orderNumber || order.order_number;
        if (confirm(`Загрузить заказ "${orderNumber}"? Текущие данные будут заменены.`)) {
            // Заполняем основные поля
            this.elements.orderNumber.value = order.orderNumber || order.order_number || '';
            this.elements.orderDate.value = order.orderDate || '';
            this.elements.customerContact.value = order.customerContact || '';
            this.elements.customerPhone.value = order.customerPhone || '';
            this.elements.performerCompany.value = order.performerCompany || this.elements.performerCompany.value;
            this.elements.performerPhone.value = order.performerPhone || this.elements.performerPhone.value;
            this.elements.problemDescription.value = order.problemDescription || order.issue_description || '';
            this.elements.technicalConclusion.value = order.technicalConclusion || '';

            // Устанавливаем заказчика
            const customerOption = Array.from(this.elements.customerSelect.options)
                .find(option => option.text === order.customerOrganization);
            if (customerOption) {
                this.elements.customerSelect.value = customerOption.value;
                this.elements.customerSelect.dispatchEvent(new Event('change'));
            }

            // Устанавливаем участок
            if (order.customerDepartment) {
                setTimeout(() => {
                    const departmentOption = Array.from(this.elements.departmentSelect.options)
                        .find(option => option.text === order.customerDepartment);
                    if (departmentOption) {
                        this.elements.departmentSelect.value = departmentOption.value;
                        this.elements.departmentSelect.dispatchEvent(new Event('change'));
                    }
                }, 100);
            }

            // Устанавливаем модель оборудования
            const modelOption = Array.from(this.elements.equipmentModel.options)
                .find(option => option.text === order.equipmentModel);
            if (modelOption) {
                this.elements.equipmentModel.value = modelOption.value;
                this.elements.equipmentModel.dispatchEvent(new Event('change'));
            }

            // Очищаем текущие таблицы
            this.clearWorksTable();
            this.clearMaterialsTable();

            // Ждем обновления доступных работ и материалов
            setTimeout(() => {
                if (items && items.length > 0) {
                    items.forEach(i => {
                        if (i.item_type === 'service') {
                            this.addWorkRow();
                            const lastWorkRow = this.worksRows[this.worksRows.length - 1];
                            const quantityInput = lastWorkRow.querySelector('.quantity-input');
                            lastWorkRow.querySelector('.work-name').textContent = '';
                            lastWorkRow.querySelector('.work-unit').textContent = '';
                            lastWorkRow.querySelector('.work-price').textContent = (i.unit_price || 0).toFixed(2);
                            quantityInput.value = i.quantity || 1;
                            this.updateWorkRowSum(lastWorkRow);
                        } else {
                            this.addMaterialRow();
                            const lastMaterialRow = this.materialsRows[this.materialsRows.length - 1];
                            const quantityInput = lastMaterialRow.querySelector('.quantity-input');
                            lastMaterialRow.querySelector('.material-name').textContent = '';
                            lastMaterialRow.querySelector('.material-unit').textContent = '';
                            lastMaterialRow.querySelector('.material-price').textContent = (i.unit_price || 0).toFixed(2);
                            quantityInput.value = i.quantity || 1;
                            this.updateMaterialRowSum(lastMaterialRow);
                        }
                    });
                } else {
                    // Fallback: старый путь из localStorage
                    if (order.works && order.works.length > 0) {
                        order.works.forEach(work => {
                            this.addWorkRow();
                            const lastWorkRow = this.worksRows[this.worksRows.length - 1];
                            const select = lastWorkRow.querySelector('.work-select');
                            const quantityInput = lastWorkRow.querySelector('.quantity-input');
                            const workOption = Array.from(select.options)
                                .find(option => {
                                    const optionText = option.textContent;
                                    return optionText.includes(work.code) || optionText.includes(work.name);
                                });
                            if (workOption) {
                                select.value = workOption.value;
                                select.dispatchEvent(new Event('change'));
                                quantityInput.value = work.quantity || 1;
                                quantityInput.dispatchEvent(new Event('input'));
                            } else {
                                lastWorkRow.querySelector('.work-name').textContent = work.name;
                                lastWorkRow.querySelector('.work-unit').textContent = work.unit || '';
                                lastWorkRow.querySelector('.work-price').textContent = (work.price || 0).toFixed(2);
                                quantityInput.value = work.quantity || 1;
                                this.updateWorkRowSum(lastWorkRow);
                            }
                        });
                    }
                    if (order.materials && order.materials.length > 0) {
                        order.materials.forEach(material => {
                            this.addMaterialRow();
                            const lastMaterialRow = this.materialsRows[this.materialsRows.length - 1];
                            const select = lastMaterialRow.querySelector('.material-select');
                            const quantityInput = lastMaterialRow.querySelector('.quantity-input');
                            const materialOption = Array.from(select.options)
                                .find(option => {
                                    const optionText = option.textContent;
                                    return optionText.includes(material.code) || optionText.includes(material.name);
                                });
                            if (materialOption) {
                                select.value = materialOption.value;
                                select.dispatchEvent(new Event('change'));
                                quantityInput.value = material.quantity || 1;
                                quantityInput.dispatchEvent(new Event('input'));
                            } else {
                                lastMaterialRow.querySelector('.material-name').textContent = material.name;
                                lastMaterialRow.querySelector('.material-unit').textContent = material.unit || '';
                                lastMaterialRow.querySelector('.material-price').textContent = (material.price || 0).toFixed(2);
                                quantityInput.value = material.quantity || 1;
                                this.updateMaterialRowSum(lastMaterialRow);
                            }
                        });
                    }
                }

                // Пересчитваем суммы
                this.calculateTotals();
            }, 200);

            // Закрываем модальное окно
            this.hideSavedOrders();
        }
    }

    async deleteOrder(orderId) {
        if (SupabaseService.isEnabled()) {
            try {
                await SupabaseService.remove('order_items', { order_id: orderId });
                await SupabaseService.remove('work_orders', { id: orderId });
                alert('Заказ удален из Supabase');
                this.showSavedOrders();
                return;
            } catch (e) {
                console.error('Ошибка удаления из Supabase', e);
            }
        }
        const savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
        const order = savedOrders.find(o => o.id === orderId);
        if (!order) {
            alert('Заказ не найден');
            return;
        }
        if (confirm(`Удалить заказ "${order.orderNumber}"? Это действие нельзя отменить.`)) {
            const updatedOrders = savedOrders.filter(o => o.id !== orderId);
            localStorage.setItem('savedOrders', JSON.stringify(updatedOrders));
            this.showSavedOrders();
            alert(`Заказ "${order.orderNumber}" удален`);
        }
    }

    // Методы для экспорта с подписями
    showExportModal() {
        this.elements.exportModal.style.display = 'block';
    }

    hideExportModal() {
        this.elements.exportModal.style.display = 'none';
    }

    proceedWithExport() {
        const selectedMode = document.querySelector('input[name="exportMode"]:checked').value;
        const withSignatures = selectedMode === 'with-signatures';
        
        this.hideExportModal();
        this.exportToPdf(withSignatures);
    }

    // Методы для FAQ модального окна
    showFaqModal() {
        this.elements.faqModal.style.display = 'block';
        // Показываем первую вкладку по умолчанию
        this.switchFaqTab('quick-start');
    }

    hideFaqModal() {
        this.elements.faqModal.style.display = 'none';
    }

    switchFaqTab(tabName) {
        // Убираем активный класс со всех кнопок вкладок
        document.querySelectorAll('.faq-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Скрываем все вкладки
        document.querySelectorAll('.faq-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Активируем нужную кнопку
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Показываем нужную вкладку
        const tabMapping = {
            'quick-start': 'quickStartTab',
            'step-by-step': 'stepByStepTab', 
            'features': 'featuresTab',
            'troubleshooting': 'troubleshootingTab'
        };

        const targetTab = document.getElementById(tabMapping[tabName]);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }

    copyDataForAI() {
        const data = this.getFormData();
        
        // Проверяем, что есть данные для копирования
        if (!data.equipmentModel && data.works.length === 0 && data.materials.length === 0) {
            alert('Заполните модель оборудования, работы или материалы для копирования данных');
            return;
        }

        // Формируем список работ
        const worksList = data.works.length > 0 
            ? data.works.map(work => `- ${work.code}: ${work.name} (${work.quantity} ${work.unit})`).join('\n')
            : 'Работы не указаны';

        // Формируем список материалов
        const materialsList = data.materials.length > 0 
            ? data.materials.map(material => `- ${material.code}: ${material.name} (${material.quantity} ${material.unit})`).join('\n')
            : 'Материалы не указаны';

        // Формируем промпт для AI
        const aiPrompt = `Создай техническое заключение для ремонта оборудования Kärcher в формате двух разделов:

ДАННЫЕ РЕМОНТА:
Модель оборудования: ${data.equipmentModel || 'Не указана'}

Выполненные работы:
${worksList}

Замененные запчасти и материалы:
${materialsList}

Общая стоимость ремонта: ${data.grandTotal.toFixed(2)} руб.

ЗАДАЧА:
Создай профессиональное техническое заключение, состоящее из двух частей:

1. "Описание неисправности:" - технический анализ проблем оборудования на основе замененных запчастей (1-2 абзаца)

2. "Итоговое техническое заключение:" - структурированное обоснование целесообразности ремонта в формате нумерованного списка (5 пунктов):
   - Экономическая эффективность (сравнение стоимости ремонта с ценой нового оборудования)
   - Сохранение немецкого качества 
   - Комплексное обновление системы
   - Проверенная производительность
   - Минимальные сроки восстановления

Используй профессиональную терминологию, конкретные технические детали и экономические обоснования. Сохраняй официальный стиль документа.`;

        // Диагностика окружения для отладки
        console.log('Clipboard API диагностика:', {
            isSecureContext: window.isSecureContext,
            hasNavigator: !!navigator,
            hasClipboard: !!navigator.clipboard,
            hasWriteText: !!(navigator.clipboard && navigator.clipboard.writeText),
            protocol: window.location.protocol,
            host: window.location.host
        });

        // Копируем в буфер обмена с расширенными проверками
        if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
            // Дополнительная проверка разрешений
            navigator.permissions.query({name: 'clipboard-write'}).then(result => {
                console.log('Clipboard permission status:', result.state);
                
                if (result.state === 'granted' || result.state === 'prompt') {
                    return navigator.clipboard.writeText(aiPrompt);
                } else {
                    throw new Error('Clipboard permission denied');
                }
            }).then(() => {
                alert('✅ Данные скопированы в буфер обмена!\n\nВставьте текст в ChatGPT или Claude для генерации технического заключения.');
            }).catch(err => {
                console.error('Ошибка копирования через Clipboard API:', err);
                console.log('Переключаемся на fallback метод...');
                this.fallbackCopyToClipboard(aiPrompt);
            });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            // Пробуем без проверки permissions (для совместимости)
            navigator.clipboard.writeText(aiPrompt).then(() => {
                alert('✅ Данные скопированы в буфер обмена!\n\nВставьте текст в ChatGPT или Claude для генерации технического заключения.');
            }).catch(err => {
                console.error('Ошибка копирования через Clipboard API (без permissions):', err);
                console.log('Переключаемся на fallback метод...');
                this.fallbackCopyToClipboard(aiPrompt);
            });
        } else {
            console.log('Clipboard API недоступен, используем fallback...');
            this.fallbackCopyToClipboard(aiPrompt);
        }
    }

    // Fallback функция для копирования в буфер обмена
    fallbackCopyToClipboard(text) {
        console.log('Используем fallback копирование...');
        
        try {
            // Проверяем, поддерживается ли execCommand
            if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) {
                console.log('document.execCommand(copy) не поддерживается');
                throw new Error('execCommand copy не поддерживается');
            }

            const textArea = document.createElement('textarea');
            textArea.value = text;
            
            // Делаем элемент невидимым, но доступным для копирования
            textArea.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 1px;
                height: 1px;
                padding: 0;
                border: none;
                outline: none;
                boxShadow: none;
                background: transparent;
                opacity: 0;
                pointer-events: none;
            `;
            
            document.body.appendChild(textArea);
            
            // Фокусируемся и выделяем текст
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, text.length);
            
            // Пытаемся скопировать
            const successful = document.execCommand('copy');
            
            // Удаляем временный элемент
            document.body.removeChild(textArea);
            
            if (successful) {
                console.log('Fallback копирование успешно');
                alert('✅ Данные скопированы в буфер обмена!\n\n(Использован резервный метод)\n\nВставьте текст в ChatGPT или Claude для генерации технического заключения.');
            } else {
                throw new Error('document.execCommand вернул false');
            }
        } catch (err) {
            console.error('Ошибка fallback копирования:', err);
            console.log('Показываем модальное окно для ручного копирования...');
            // Показываем данные в модальном окне для ручного копирования
            this.showManualCopyDialog(text);
        }
    }

    // Показать диалог для ручного копирования
    showManualCopyDialog(text) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
        `;

        dialog.innerHTML = `
            <h3>📋 Ручное копирование данных</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid #17a2b8;">
                <p style="margin: 0; color: #666;"><strong>Автоматическое копирование недоступно в вашем браузере.</strong></p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Это может происходить из-за настроек безопасности или типа браузера.</p>
            </div>
            <p><strong>Инструкция:</strong></p>
            <ol style="margin: 10px 0; padding-left: 20px; color: #333;">
                <li>Нажмите в текстовое поле ниже</li>
                <li>Выделите весь текст (Ctrl+A)</li>
                <li>Скопируйте его (Ctrl+C)</li>
                <li>Вставьте в ChatGPT или Claude</li>
            </ol>
            <textarea readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 11px; border: 2px solid #ddd; border-radius: 4px; padding: 10px; resize: vertical;" placeholder="Данные для копирования...">${text}</textarea>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="this.closest('.manual-copy-modal').remove()" style="padding: 12px 24px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-right: 10px;">✅ Готово</button>
                <button onclick="navigator.clipboard ? navigator.clipboard.writeText(this.parentElement.parentElement.querySelector('textarea').value).then(() => alert('✅ Скопировано!')).catch(() => alert('❌ Не удалось')) : alert('❌ Clipboard API недоступен')" style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">🔄 Попробовать снова</button>
            </div>
        `;

        modal.className = 'manual-copy-modal';
        modal.appendChild(dialog);
        document.body.appendChild(modal);

        // Автоматически выделяем текст
        const textarea = dialog.querySelector('textarea');
        textarea.focus();
        textarea.select();

        // Закрытие по клику на фон
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Экспорт всех данных
    exportAllData() {
        console.log('exportAllData method called');
        try {
            const allData = {
                savedOrders: JSON.parse(localStorage.getItem('savedOrders') || '[]'),
                customers: JSON.parse(localStorage.getItem('customers') || '[]'),
                models: JSON.parse(localStorage.getItem('models') || '[]'),
                works: JSON.parse(localStorage.getItem('works') || '[]'),
                materials: JSON.parse(localStorage.getItem('materials') || '[]'),
                signatureImage: localStorage.getItem('signatureImage'),
                stampImage: localStorage.getItem('stampImage'),
                exportDate: new Date().toISOString(),
                appVersion: "1.0.0"
            };

            const dataStr = JSON.stringify(allData, null, 2);
            console.log('Data prepared for export, size:', dataStr.length);

            // Проверяем поддержку современных API
            if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
                console.log('Using modern download method');
                this.downloadUsingBlob(dataStr, allData);
            } else {
                console.log('Using fallback download method');
                this.downloadUsingFallback(dataStr, allData);
            }
            
        } catch (error) {
            console.error('Ошибка экспорта:', error);
            alert(`Ошибка при экспорте данных: ${error.message}\n\nПроверьте консоль браузера для подробностей.`);
        }
    }

    // Современный метод скачивания через Blob
    downloadUsingBlob(dataStr, allData) {
        try {
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `orders_backup_${new Date().toISOString().split('T')[0]}.json`;
            
            // Добавляем элемент в DOM для некоторых браузеров
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Очищаем URL объект
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
            
            this.showExportSuccess(allData);
        } catch (error) {
            console.error('Blob download failed:', error);
            this.downloadUsingFallback(dataStr, allData);
        }
    }

    // Альтернативный метод для старых браузеров
    downloadUsingFallback(dataStr, allData) {
        try {
            // Метод 1: Data URL
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const link = document.createElement('a');
            link.href = dataUri;
            link.download = `orders_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showExportSuccess(allData);
        } catch (error) {
            console.error('Fallback download failed:', error);
            // Метод 2: Показать данные в новом окне для копирования
            this.showDataForCopy(dataStr, allData);
        }
    }

    // Показать данные для ручного копирования
    showDataForCopy(dataStr, allData) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <html>
                <head><title>Экспорт данных - Копирование</title></head>
                <body>
                    <h2>Экспорт данных</h2>
                    <p>Скопируйте данные ниже и сохраните в файл с расширением .json:</p>
                    <textarea style="width:100%; height:400px; font-family:monospace;">${dataStr}</textarea>
                    <br><br>
                    <button id="copyBtn">Копировать в буфер</button>
                    <script>
                        document.getElementById('copyBtn').addEventListener('click', () => {
                            const textarea = document.querySelector('textarea');
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(textarea.value).then(() => alert('Скопировано в буфер обмена!'));
                            } else {
                                // Fallback для старых браузеров
                                textarea.select();
                                document.execCommand('copy');
                                alert('Скопировано в буфер обмена!');
                            }
                        });
                    </script>
                </body>
                </html>
            `);
            this.showExportSuccess(allData);
        } else {
            // Если не удается открыть новое окно, показываем alert с инструкцией
            alert(`Не удалось автоматически скачать файл.\n\nОткройте консоль браузера (F12) и скопируйте данные из следующего сообщения:`);
            console.log('=== ДАННЫЕ ДЛЯ ЭКСПОРТА ===');
            console.log(dataStr);
            console.log('=== КОНЕЦ ДАННЫХ ===');
            this.showExportSuccess(allData);
        }
    }

    // Показать сообщение об успешном экспорте
    showExportSuccess(allData) {
        alert(`Экспорт завершен! Сохранено:\n• Заказ-нарядов: ${allData.savedOrders.length}\n• Контрагентов: ${allData.customers.length}\n• Моделей техники: ${allData.models.length}\n• Работ: ${allData.works.length}\n• Материалов: ${allData.materials.length}`);
    }

    // Показать диалог импорта
    showImportDialog() {
        console.log('showImportDialog method called');
        
        // Сначала пытаемся открыть диалог файла напрямую (без confirm)
        // Это работает, потому что вызывается сразу после клика пользователя
        try {
            console.log('Attempting direct file dialog...');
            if (this.elements.importFileInput) {
                // Добавляем обработчик на случай, если пользователь отменит выбор файла
                const originalOnChange = this.elements.importFileInput.onchange;
                
                const timeoutId = setTimeout(() => {
                    // Если через 1 секунду файл не выбран, предлагаем альтернативу
                    this.showImportAlternative();
                }, 1000);
                
                // Временный обработчик для отслеживания выбора файла
                this.elements.importFileInput.onchange = (e) => {
                    clearTimeout(timeoutId);
                    if (originalOnChange) {
                        originalOnChange.call(this.elements.importFileInput, e);
                    }
                    this.importAllData(e);
                };
                
                this.elements.importFileInput.click();
                console.log('File dialog opened successfully');
            } else {
                console.error('Import file input not found');
                this.showImportAlternative();
            }
        } catch (error) {
            console.error('Failed to open file dialog:', error);
            this.showImportAlternative();
        }
    }
    
    // Показать альтернативные способы импорта
    showImportAlternative() {
        const choice = confirm('Выберите альтернативный способ импорта:\n\nOK - Вставить JSON данные\nОтмена - Попробовать выбор файла снова');
        
        if (choice) {
            console.log('Starting text import alternative');
            this.showTextImportDialog();
        } else {
            console.log('User cancelled import');
            alert('Импорт отменен. Попробуйте еще раз или используйте способ с вставкой данных.');
        }
    }

    // Показать диалог для импорта через текст
    showTextImportDialog() {
        const importData = prompt(`Вставьте JSON данные для импорта:\n\n(Скопируйте содержимое файла резервной копии)`);
        
        if (importData && importData.trim()) {
            try {
                const mockEvent = {
                    target: {
                        result: importData.trim(),
                        value: ''
                    }
                };
                this.processImportData(mockEvent);
            } catch (error) {
                console.error('Text import error:', error);
                alert(`Ошибка при импорте данных из текста: ${error.message}`);
            }
        }
    }

    // Импорт всех данных
    importAllData(event) {
        const file = event.target.files[0];
        if (!file) return;

        console.log('File selected for import:', file.name, 'size:', file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            this.processImportData(e);
            // Очищаем input файла
            event.target.value = '';
        };

        reader.onerror = (e) => {
            console.error('File reading error:', e);
            alert('Ошибка при чтении файла. Попробуйте выбрать другой файл.');
            event.target.value = '';
        };

        reader.readAsText(file);
    }

    // Универсальная функция обработки данных импорта
    processImportData(e) {
        try {
            console.log('Processing import data...');
            const importedData = JSON.parse(e.target.result);
            
            // Дополнительная проверка безопасности
            if (JSON.stringify(importedData).length > 50 * 1024 * 1024) { // 50MB лимит
                throw new Error('Файл слишком большой для импорта');
            }
            
            // Проверяем структуру данных
            if (!importedData || typeof importedData !== 'object') {
                throw new Error('Неверный формат файла');
            }

            console.log('Import data parsed successfully:', Object.keys(importedData));

            let importSummary = [];
            
            // Импортируем заказ-наряды
            if (importedData.savedOrders && Array.isArray(importedData.savedOrders)) {
                localStorage.setItem('savedOrders', JSON.stringify(importedData.savedOrders));
                importSummary.push(`Заказ-нарядов: ${importedData.savedOrders.length}`);
                console.log('Imported orders:', importedData.savedOrders.length);
            }

            // Импортируем справочники
            if (importedData.customers && Array.isArray(importedData.customers)) {
                localStorage.setItem('customers', JSON.stringify(importedData.customers));
                importSummary.push(`Контрагентов: ${importedData.customers.length}`);
            }

            if (importedData.models && Array.isArray(importedData.models)) {
                localStorage.setItem('models', JSON.stringify(importedData.models));
                importSummary.push(`Моделей техники: ${importedData.models.length}`);
            }

            if (importedData.works && Array.isArray(importedData.works)) {
                localStorage.setItem('works', JSON.stringify(importedData.works));
                importSummary.push(`Работ: ${importedData.works.length}`);
            }

            if (importedData.materials && Array.isArray(importedData.materials)) {
                localStorage.setItem('materials', JSON.stringify(importedData.materials));
                importSummary.push(`Материалов: ${importedData.materials.length}`);
            }

            // Импортируем изображения
            if (importedData.signatureImage) {
                localStorage.setItem('signatureImage', importedData.signatureImage);
                importSummary.push('Подпись исполнителя');
            }

            if (importedData.stampImage) {
                localStorage.setItem('stampImage', importedData.stampImage);
                importSummary.push('Печать организации');
            }

            // Перезагружаем справочники если есть ReferenceManager
            if (window.referenceManager && typeof window.referenceManager.loadReferences === 'function') {
                console.log('Reloading references...');
                window.referenceManager.loadReferences();
                if (typeof window.referenceManager.updateReferenceSelects === 'function') {
                    window.referenceManager.updateReferenceSelects();
                }
                if (typeof window.referenceManager.loadSignatures === 'function') {
                    window.referenceManager.loadSignatures();
                }
            }

            console.log('Import completed successfully');
            alert(`Импорт завершен успешно!\n\nИмпортировано:\n• ${importSummary.join('\n• ')}\n\nДата экспорта: ${importedData.exportDate ? new Date(importedData.exportDate).toLocaleString('ru-RU') : 'Неизвестно'}`);
            
        } catch (error) {
            console.error('Ошибка импорта:', error);
            alert(`Ошибка при импорте данных: ${error.message}\n\nПроверьте, что данные содержат корректный JSON формат.`);
        }
    }


}

// Класс для управления справочниками
class ReferenceManager {
    constructor() {
        this.initializeElements();
        this.loadReferences();
        this.setupEventListeners();
        updateDataSourceIndicator();
        if (SupabaseService.isEnabled()) {
            this.loadReferencesFromSupabase().catch(err => console.error('Ошибка загрузки справочников из Supabase', err));
        }
    }

    initializeElements() {
        // Кнопки и модальные окна
        this.manageReferencesBtn = document.getElementById('manageReferences');
        this.referencesModal = document.getElementById('referencesModal');
        this.closeBtn = this.referencesModal.querySelector('.close');

        // Вкладки
        this.tabBtns = this.referencesModal.querySelectorAll('.tab-btn');
        this.tabContents = this.referencesModal.querySelectorAll('.tab-content');

        // Формы добавления
        this.customerForm = {
            name: document.getElementById('customerName'),
            addBtn: document.getElementById('addCustomer'),
            list: document.getElementById('customersList')
        };

        this.modelForm = {
            code: document.getElementById('modelCode'),
            name: document.getElementById('modelName'),
            addBtn: document.getElementById('addModel'),
            list: document.getElementById('modelsList')
        };

        this.workForm = {
            model: document.getElementById('workModel'),
            code: document.getElementById('workCode'),
            name: document.getElementById('workName'),
            unit: document.getElementById('workUnit'),
            price: document.getElementById('workPrice'),
            addBtn: document.getElementById('addWork'),
            list: document.getElementById('worksList')
        };

        this.materialForm = {
            model: document.getElementById('materialModel'),
            code: document.getElementById('materialCode'),
            name: document.getElementById('materialName'),
            unit: document.getElementById('materialUnit'),
            price: document.getElementById('materialPrice'),
            addBtn: document.getElementById('addMaterial'),
            list: document.getElementById('materialsList')
        };

        // Элементы для управления подписями
        this.signatureElements = {
            signatureFile: document.getElementById('signatureFile'),
            uploadSignature: document.getElementById('uploadSignature'),
            removeSignature: document.getElementById('removeSignature'),
            signaturePreview: document.getElementById('signaturePreview'),
            stampFile: document.getElementById('stampFile'),
            uploadStamp: document.getElementById('uploadStamp'),
            removeStamp: document.getElementById('removeStamp'),
            stampPreview: document.getElementById('stampPreview')
        };
    }

    setupEventListeners() {
        // Открытие/закрытие модального окна
        this.manageReferencesBtn.addEventListener('click', () => this.showModal());
        this.closeBtn.addEventListener('click', () => this.hideModal());
        this.referencesModal.addEventListener('click', (e) => {
            if (e.target === this.referencesModal) this.hideModal();
        });

        // Переключение вкладок
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Добавление элементов
        this.customerForm.addBtn.addEventListener('click', () => this.addCustomer());
        this.modelForm.addBtn.addEventListener('click', () => this.addModel());
        this.workForm.addBtn.addEventListener('click', () => this.addWork());
        this.materialForm.addBtn.addEventListener('click', () => this.addMaterial());

        // Enter для добавления
        this.customerForm.name.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCustomer();
        });

        // Обработчики для подписей
        this.signatureElements.uploadSignature.addEventListener('click', () => {
            this.signatureElements.signatureFile.click();
        });
        this.signatureElements.signatureFile.addEventListener('change', (e) => {
            this.handleImageUpload(e, 'signature');
        });
        this.signatureElements.removeSignature.addEventListener('click', () => {
            this.removeImage('signature');
        });

        this.signatureElements.uploadStamp.addEventListener('click', () => {
            this.signatureElements.stampFile.click();
        });
        this.signatureElements.stampFile.addEventListener('change', (e) => {
            this.handleImageUpload(e, 'stamp');
        });
        this.signatureElements.removeStamp.addEventListener('click', () => {
            this.removeImage('stamp');
        });
    }

    showModal() {
        this.referencesModal.style.display = 'block';
        this.updateModelSelects();
        this.renderAllLists();
        this.loadSignatures();
    }

    hideModal() {
        this.referencesModal.style.display = 'none';
    }

    switchTab(tabName) {
        // Деактивируем все вкладки
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));

        // Активируем нужную вкладку
        const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeContent = document.getElementById(`${tabName}Tab`);
        
        if (activeBtn && activeContent) {
            activeBtn.classList.add('active');
            activeContent.classList.add('active');
        }
    }

    loadReferences() {
        // Загружаем справочники из localStorage или используем значения по умолчанию
        this.references = {
            customers: JSON.parse(localStorage.getItem('customers') || '["ООО \"Белоярская АЭС - Авто\""]'),
            models: JSON.parse(localStorage.getItem('models') || '[]'),
            works: JSON.parse(localStorage.getItem('works') || '[]'),
            materials: JSON.parse(localStorage.getItem('materials') || '[]')
        };
        
        // Если контрагентов нет, добавляем Белоярскую АЭС по умолчанию
        if (this.references.customers.length === 0) {
            this.references.customers = ['ООО "Белоярская АЭС - Авто"'];
            this.saveReference('customers');
        }

        // Если справочники пусты, загружаем из specificationData
        if (this.references.models.length === 0) {
            this.references.models = [...specificationData.models];
            this.saveReference('models');
        }
        if (this.references.works.length === 0) {
            this.references.works = [...specificationData.works];
            this.saveReference('works');
        }
        if (this.references.materials.length === 0) {
            this.references.materials = [...specificationData.materials];
            this.saveReference('materials');
        }
    }

    saveReference(type) {
        localStorage.setItem(type, JSON.stringify(this.references[type]));
    }

    async addCustomer() {
        const name = this.customerForm.name.value.trim();
        if (!name) {
            alert('Введите название организации');
            return;
        }

        if (this.references.customers.includes(name)) {
            alert('Такая организация уже существует');
            return;
        }

        if (SupabaseService.isEnabled()) {
            try {
                await SupabaseService.insert('counterparties', { name });
                await this.loadReferencesFromSupabase();
            } catch (e) {
                console.error('Ошибка добавления контрагента в Supabase', e);
                this.references.customers.push(name);
                this.saveReference('customers');
            }
        } else {
            this.references.customers.push(name);
            this.saveReference('customers');
        }
        this.customerForm.name.value = '';
        this.renderCustomersList();
        if (orderForm) {
            orderForm.updateCustomerOptions();
        }
        alert('Организация добавлена успешно');
    }

	async addModel() {
        const code = this.modelForm.code.value.trim();
        const name = this.modelForm.name.value.trim();

        if (!code || !name) {
            alert('Заполните все поля');
            return;
        }

        if (this.references.models.some(m => m.code === code)) {
            alert('Техника с таким кодом уже существует');
            return;
        }

        if (SupabaseService.isEnabled()) {
            try {
                await SupabaseService.insert('equipment_models', { name, brand: code || null });
                await this.loadReferencesFromSupabase();
            } catch (e) {
                console.error('Ошибка добавления модели в Supabase', e);
                this.references.models.push({ code, name });
                this.saveReference('models');
            }
        } else {
            this.references.models.push({ code, name });
            this.saveReference('models');
        }
        
        this.modelForm.code.value = '';
        this.modelForm.name.value = '';
        
        this.renderModelsList();
        this.updateModelSelects();
        if (orderForm) {
            orderForm.loadModels();
        }
        alert('Техника добавлена успешно');
    }

    addWork() {
        const model = this.workForm.model.value;
        const code = this.workForm.code.value.trim();
        const name = this.workForm.name.value.trim();
        const unit = this.workForm.unit.value.trim();
        const price = parseFloat(this.workForm.price.value);

        if (!model || !code || !name || !unit || isNaN(price)) {
            alert('Заполните все поля');
            return;
        }

        const key = `${model}||${name}`;
        
        // Проверяем уникальность
        if (this.references.works.some(w => w.key === key)) {
            alert('Такая работа для данной техники уже существует');
            return;
        }

        this.references.works.push({ key, model, code, name, unit, price });
        this.saveReference('works');
        
        this.workForm.code.value = '';
        this.workForm.name.value = '';
        this.workForm.unit.value = '';
        this.workForm.price.value = '';
        
        this.renderWorksList();

        alert('Работа добавлена успешно');
    }

    addMaterial() {
        const model = this.materialForm.model.value;
        const code = this.materialForm.code.value.trim();
        const name = this.materialForm.name.value.trim();
        const unit = this.materialForm.unit.value.trim();
        const price = parseFloat(this.materialForm.price.value);

        if (!model || !code || !name || !unit || isNaN(price)) {
            alert('Заполните все поля');
            return;
        }

        const key = `${model}||${name}`;
        
        // Проверяем уникальность
        if (this.references.materials.some(m => m.key === key)) {
            alert('Такой материал для данной техники уже существует');
            return;
        }

        this.references.materials.push({ key, model, code, name, unit, price });
        this.saveReference('materials');
        
        this.materialForm.code.value = '';
        this.materialForm.name.value = '';
        this.materialForm.unit.value = '';
        this.materialForm.price.value = '';
        
        this.renderMaterialsList();

        alert('Материал добавлен успешно');
    }

    updateModelSelects() {
        const selects = [this.workForm.model, this.materialForm.model];
        
        selects.forEach(select => {
            // Сохраняем текущее значение
            const currentValue = select.value;
            
            // Очищаем и заполняем заново
            while (select.children.length > 2) { // Оставляем первые два option
                select.removeChild(select.lastChild);
            }
            
            this.references.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = `${model.code} - ${model.name}`;
                select.appendChild(option);
            });
            
            // Восстанавливаем значение
            select.value = currentValue;
        });
    }

    renderAllLists() {
        this.renderCustomersList();
        this.renderModelsList();
        this.renderWorksList();
        this.renderMaterialsList();
    }

    renderCustomersList() {
        this.customerForm.list.innerHTML = '';
        
        if (this.references.customers.length === 0) {
            this.customerForm.list.innerHTML = '<div class="empty-list">Контрагенты не добавлены</div>';
            return;
        }

        this.references.customers.forEach((customer, index) => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-item-info">
                    <div class="reference-item-title">${customer}</div>
                </div>
                <div class="reference-item-actions">
                    <button class="btn-remove" data-index="${index}" data-type="customer">Удалить</button>
                </div>
            `;
            this.customerForm.list.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.addRemoveButtonHandlers();
    }

    renderModelsList() {
        this.modelForm.list.innerHTML = '';
        
        if (this.references.models.length === 0) {
            this.modelForm.list.innerHTML = '<div class="empty-list">Техника не добавлена</div>';
            return;
        }

        this.references.models.forEach((model, index) => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-item-info">
                    <div class="reference-item-title">${model.name}</div>
                    <div class="reference-item-details">
                        <div class="reference-item-detail"><strong>Код:</strong> ${model.code}</div>
                    </div>
                </div>
                <div class="reference-item-actions">
                    <button class="btn-remove" data-index="${index}" data-type="model">Удалить</button>
                </div>
            `;
            this.modelForm.list.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.addRemoveButtonHandlers();
    }

    renderWorksList() {
        this.workForm.list.innerHTML = '';
        
        if (this.references.works.length === 0) {
            this.workForm.list.innerHTML = '<div class="empty-list">Работы не добавлены</div>';
            return;
        }

        this.references.works.forEach((work, index) => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-item-info">
                    <div class="reference-item-title">${work.name}</div>
                    <div class="reference-item-details">
                        <div class="reference-item-detail"><strong>Код:</strong> ${work.code}</div>
                        <div class="reference-item-detail"><strong>Техника:</strong> ${work.model}</div>
                        <div class="reference-item-detail"><strong>Ед. изм.:</strong> ${work.unit}</div>
                        <div class="reference-item-detail"><strong>Цена:</strong> ${work.price.toFixed(2)} ₽</div>
                    </div>
                </div>
                <div class="reference-item-actions">
                    <button class="btn-remove" data-index="${index}" data-type="work">Удалить</button>
                </div>
            `;
            this.workForm.list.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.addRemoveButtonHandlers();
    }

    renderMaterialsList() {
        this.materialForm.list.innerHTML = '';
        
        if (this.references.materials.length === 0) {
            this.materialForm.list.innerHTML = '<div class="empty-list">Материалы не добавлены</div>';
            return;
        }

        this.references.materials.forEach((material, index) => {
            const item = document.createElement('div');
            item.className = 'reference-item';
            item.innerHTML = `
                <div class="reference-item-info">
                    <div class="reference-item-title">${material.name}</div>
                    <div class="reference-item-details">
                        <div class="reference-item-detail"><strong>Код:</strong> ${material.code}</div>
                        <div class="reference-item-detail"><strong>Техника:</strong> ${material.model}</div>
                        <div class="reference-item-detail"><strong>Ед. изм.:</strong> ${material.unit}</div>
                        <div class="reference-item-detail"><strong>Цена:</strong> ${material.price.toFixed(2)} ₽</div>
                    </div>
                </div>
                <div class="reference-item-actions">
                    <button class="btn-remove" data-index="${index}" data-type="material">Удалить</button>
                </div>
            `;
            this.materialForm.list.appendChild(item);
        });
        
        // Добавляем обработчики для кнопок удаления
        this.addRemoveButtonHandlers();
    }

    // Универсальный обработчик для кнопок удаления
    addRemoveButtonHandlers() {
        // Удаляем старые обработчики, чтобы избежать дублирования
        this.referencesModal.querySelectorAll('.btn-remove').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Добавляем новые обработчики
        this.referencesModal.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const type = e.target.dataset.type;
                
                switch(type) {
                    case 'customer':
                        this.removeCustomer(index);
                        break;
                    case 'model':
                        this.removeModel(index);
                        break;
                    case 'work':
                        this.removeWork(index);
                        break;
                    case 'material':
                        this.removeMaterial(index);
                        break;
                }
            });
        });
    }

    async removeCustomer(index) {
        if (confirm('Удалить организацию?')) {
            const name = this.references.customers[index];
            if (SupabaseService.isEnabled()) {
                try {
                    await SupabaseService.remove('counterparties', { name });
                    await this.loadReferencesFromSupabase();
                } catch (e) {
                    console.error('Ошибка удаления контрагента из Supabase', e);
                    this.references.customers.splice(index, 1);
                    this.saveReference('customers');
                }
            } else {
                this.references.customers.splice(index, 1);
                this.saveReference('customers');
            }
            this.renderCustomersList();
            if (orderForm) {
                orderForm.updateCustomerOptions();
            }
        }
    }

	async removeModel(index) {
        if (confirm('Удалить технику? Связанные работы и материалы также будут удалены.')) {
            const modelToRemove = this.references.models[index];
            this.references.works = this.references.works.filter(w => w.model !== modelToRemove.name);
            this.references.materials = this.references.materials.filter(m => m.model !== modelToRemove.name);
            if (SupabaseService.isEnabled()) {
                try {
                    await SupabaseService.remove('equipment_models', { name: modelToRemove.name });
                    await this.loadReferencesFromSupabase();
                } catch (e) {
                    console.error('Ошибка удаления модели из Supabase', e);
                    this.references.models.splice(index, 1);
                    this.saveReference('models');
                    this.saveReference('works');
                    this.saveReference('materials');
                }
            } else {
                this.references.models.splice(index, 1);
                this.saveReference('models');
                this.saveReference('works');
                this.saveReference('materials');
            }
            this.renderAllLists();
            this.updateModelSelects();
            if (orderForm) {
                orderForm.loadModels();
            }
        }
    }

    removeWork(index) {
        if (confirm('Удалить работу?')) {
            this.references.works.splice(index, 1);
            this.saveReference('works');
            this.renderWorksList();
        }
    }

    removeMaterial(index) {
        if (confirm('Удалить материал?')) {
            this.references.materials.splice(index, 1);
            this.saveReference('materials');
            this.renderMaterialsList();
        }
    }

    // Методы для получения данных (используются в OrderForm)
    getCustomers() {
        return this.references.customers;
    }

    getModels() {
        return this.references.models;
    }

    getWorks() {
        return this.references.works;
    }

    getMaterials() {
        return this.references.materials;
    }

    // Методы для работы с подписями и печатями
    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Можно загружать только изображения');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Размер файла не должен превышать 2MB');
            return;
        }

        // Если Supabase доступен — загружаем в Storage и сохраняем ссылку в БД
        if (SupabaseService.isEnabled()) {
            (async () => {
                try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${type}-${Date.now()}.${fileExt}`;
                    const path = `${fileName}`;
                    const publicUrl = await SupabaseService.uploadToStorage('signatures', path, file);
                    // Сохраняем запись в таблицу
                    await SupabaseService.insert('signatures_stamps', {
                        name: type === 'signature' ? 'Подпись исполнителя' : 'Печать организации',
                        image_url: publicUrl,
                        type
                    });
                    // Отображаем
                    this.displayImage(type, publicUrl);
                } catch (e) {
                    console.error('Ошибка загрузки в Supabase Storage', e);
                    // Fallback: localStorage
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const imageData = ev.target.result;
                        this.saveImage(type, imageData);
                        this.displayImage(type, imageData);
                    };
                    reader.readAsDataURL(file);
                }
            })();
            return;
        }

        // Fallback: localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            this.saveImage(type, imageData);
            this.displayImage(type, imageData);
        };
        reader.readAsDataURL(file);
    }

    saveImage(type, imageData) {
        localStorage.setItem(`${type}Image`, imageData);
    }

    async loadSignatures() {
        if (SupabaseService.isEnabled()) {
            try {
                const rows = await SupabaseService.select('signatures_stamps', '*', q => q.order('created_at', { ascending: false }));
                const sig = rows.find(r => r.type === 'signature');
                const st = rows.find(r => r.type === 'stamp');
                if (sig) this.displayImage('signature', sig.image_url); else this.showImagePlaceholder('signature');
                if (st) this.displayImage('stamp', st.image_url); else this.showImagePlaceholder('stamp');
                return;
            } catch (e) {
                console.error('Ошибка загрузки подписей из Supabase', e);
            }
        }
        const signatureData = localStorage.getItem('signatureImage');
        const stampData = localStorage.getItem('stampImage');
        if (signatureData) this.displayImage('signature', signatureData); else this.showImagePlaceholder('signature');
        if (stampData) this.displayImage('stamp', stampData); else this.showImagePlaceholder('stamp');
    }

    displayImage(type, imageData) {
        const previewElement = type === 'signature' 
            ? this.signatureElements.signaturePreview 
            : this.signatureElements.stampPreview;
        const removeButton = type === 'signature' 
            ? this.signatureElements.removeSignature 
            : this.signatureElements.removeStamp;

        previewElement.innerHTML = `<img src="${imageData}" alt="${type === 'signature' ? 'Подпись' : 'Печать'}">`;
        previewElement.classList.add('has-image');
        removeButton.style.display = 'inline-block';
    }

    showImagePlaceholder(type) {
        const previewElement = type === 'signature' 
            ? this.signatureElements.signaturePreview 
            : this.signatureElements.stampPreview;
        const removeButton = type === 'signature' 
            ? this.signatureElements.removeSignature 
            : this.signatureElements.removeStamp;

        previewElement.innerHTML = `<div class="placeholder">${type === 'signature' ? 'Подпись не загружена' : 'Печать не загружена'}</div>`;
        previewElement.classList.remove('has-image');
        removeButton.style.display = 'none';
    }

    async removeImage(type) {
        if (confirm(`Удалить ${type === 'signature' ? 'подпись' : 'печать'}?`)) {
            if (SupabaseService.isEnabled()) {
                try {
                    await SupabaseService.remove('signatures_stamps', { type });
                } catch (e) {
                    console.error('Ошибка удаления записи подписи/печати из Supabase', e);
                }
            }
            localStorage.removeItem(`${type}Image`);
            this.showImagePlaceholder(type);
            const fileInput = type === 'signature' 
                ? this.signatureElements.signatureFile 
                : this.signatureElements.stampFile;
            fileInput.value = '';
        }
    }

    // Методы для получения изображений (используются при экспорте)
    getSignatureImage() {
        return localStorage.getItem('signatureImage');
    }

    getStampImage() {
        return localStorage.getItem('stampImage');
    }

    async loadReferencesFromSupabase() {
        try {
            const counterparties = await SupabaseService.select('counterparties', 'id,name,contact_info', q => q.order('created_at', { ascending: true }));
            if (Array.isArray(counterparties)) {
                this.references.customers = counterparties.map(c => c.name);
                this.saveReference('customers');
                this.renderCustomersList();
                if (window.orderForm && typeof window.orderForm.updateCustomerOptions === 'function') {
                    window.orderForm.updateCustomerOptions();
                }
            }
            const models = await SupabaseService.select('equipment_models', 'id,name,brand', q => q.order('created_at', { ascending: true }));
            if (Array.isArray(models)) {
                this.references.models = models.map(m => ({ code: m.brand || '', name: m.name }));
                this.saveReference('models');
                this.renderModelsList();
                this.updateModelSelects();
                if (window.orderForm && typeof window.orderForm.loadModels === 'function') {
                    window.orderForm.loadModels();
                }
            }
        } catch (e) {
            console.error('loadReferencesFromSupabase error', e);
        }
    }
}

// Инициализация приложения
let orderForm;
let referenceManager;

document.addEventListener('DOMContentLoaded', () => {
    window.referenceManager = new ReferenceManager();
    window.orderForm = new OrderForm();
});
