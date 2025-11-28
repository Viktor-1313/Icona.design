const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100; // отдельный порт
const DATA_FILE = path.join(__dirname, 'gantt-state.json');
const COMPANY_FILE = path.join(__dirname, 'company-info.json');

// парсим JSON и разрешаем запросы с файловой страницы
app.use(cors());
app.use(express.json());

// отдаём статику из папки 1 (твой index (1) (1).html)
app.use(express.static(__dirname));

// получить сохранённое состояние графика
app.get('/api/gantt-state', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch {
    res.json(null);
  }
});

// сохранить состояние графика
app.post('/api/gantt-state', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('Ошибка сохранения gantt-state:', e);
    res.status(500).json({ ok: false, error: 'save_failed' });
  }
});

// получить информацию о компании (название и логотип)
app.get('/api/company-info', (req, res) => {
  try {
    const raw = fs.readFileSync(COMPANY_FILE, 'utf8');
    res.json(JSON.parse(raw));
  } catch {
    res.json(null);
  }
});

// сохранить информацию о компании
app.post('/api/company-info', (req, res) => {
  try {
    // ожидаем объект вида { name: string, logoData: string | null }
    fs.writeFileSync(COMPANY_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    console.error('Ошибка сохранения company-info:', e);
    res.status(500).json({ ok: false, error: 'save_failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Gantt server running on http://localhost:${PORT}`);
});