import { useState, useMemo } from "react";

// Допоміжна функція для класів
const cn = (...classes) => classes.filter(Boolean).join(" ");

const ACTIVITY_LEVELS = [
  { id: 1, multiplier: 1.2, label: "Мінімальна", desc: "Сидяча робота, без спорту" },
  { id: 2, multiplier: 1.375, label: "Легка", desc: "Сидіти + легкі вправи 1-3 рази/тижд" },
  { id: 3, multiplier: 1.55, label: "Середня", desc: "Активна робота + 3-5 тренувань" },
  { id: 4, multiplier: 1.725, label: "Висока", desc: "Важка праця + 5-7 тренувань" },
  { id: 5, multiplier: 1.9, label: "Екстремальна", desc: "Проф. спорт або дуже важка фізична праця" },
];

const GOALS = [
  { id: "cut", label: "Схуднення", adj: -200, pMulti: 2.2 }, // Змінено на 200
  { id: "maintain", label: "Підтримка", adj: 0, pMulti: 2 },
  { id: "bulk", label: "Набір", adj: 200, pMulti: 1.8 },    // Змінено на 200
];

export default function App() {
  const [weight, setWeight] = useState("75");
  const [height, setHeight] = useState("180");
  const [age, setAge] = useState("25");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.55);
  const [goalId, setGoalId] = useState("maintain");
  const [bodyFat, setBodyFat] = useState(20);

  // Головний розрахунок
  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    const bf = parseFloat(bodyFat);

    if (!w || !h || !a || isNaN(bf)) return null;

    // Формула Катча-МакАрдла (точна по жиру)
    const lbm = w * (1 - bf / 100);
    const bmr = 370 + (21.6 * lbm);
    
    const tdee = bmr * activity;
    const currentGoal = GOALS.find(g => g.id === goalId);
    const totalCalories = tdee + currentGoal.adj;

    const protein = w * currentGoal.pMulti;
    const fat = w * 0.9;
    const carbs = (totalCalories - (protein * 4) - (fat * 9)) / 4;

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(Math.max(0, carbs)),
      bmr: Math.round(bmr)
    };
  }, [weight, height, age, activity, goalId, bodyFat]);

  const fats = gender === "male" ? [10, 15, 20, 25, 30, 35, 40] : [16, 20, 24, 28, 32, 36, 42];

  return (
    <div className="min-h-screen p-4 font-sans bg-slate-50 md:p-10 text-slate-900">
      <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto lg:grid-cols-12">
        
        {/* ЛІВА ЧАСТИНА: ВВОД ДАНИХ */}
        <div className="p-6 space-y-6 bg-white border shadow-sm lg:col-span-7 rounded-3xl border-slate-200">
          <h2 className="pb-4 text-2xl font-bold border-b">Налаштування профілю</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => {setGender('male'); setBodyFat(15)}} className={cn("py-3 rounded-2xl font-bold transition-all", gender === 'male' ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500")}>Чоловік ♂</button>
            <button onClick={() => {setGender('female'); setBodyFat(24)}} className={cn("py-3 rounded-2xl font-bold transition-all", gender === 'female' ? "bg-pink-500 text-white shadow-lg shadow-pink-200" : "bg-slate-100 text-slate-500")}>Жінка ♀</button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="ml-2 text-xs font-bold uppercase text-slate-400">Вага</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full p-3 border-none outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="ml-2 text-xs font-bold uppercase text-slate-400">Зріст</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full p-3 border-none outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="ml-2 text-xs font-bold uppercase text-slate-400">Вік</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full p-3 border-none outline-none bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>

          <div>
            <label className="block mb-2 ml-2 text-xs font-bold uppercase text-slate-400">Відсоток жиру (обери фото)</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {fats.map(f => (
                <button key={f} onClick={() => setBodyFat(f)} className={cn("relative rounded-xl overflow-hidden border-4 transition-all", bodyFat === f ? "border-blue-500 scale-105 z-10 shadow-lg" : "border-transparent opacity-70 hover:opacity-100")}>
                  <img src={`/body-types/${gender}/fat-${f}.png`} alt="" className="object-cover w-full h-20" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/50 text-[10px] text-white font-bold">{f}%</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-xs font-bold uppercase text-slate-400">Активність</label>
            <div className="grid gap-2">
              {ACTIVITY_LEVELS.map(a => (
                <button key={a.id} onClick={() => setActivity(a.multiplier)} className={cn("p-3 text-left rounded-2xl border-2 transition-all", activity === a.multiplier ? "border-blue-500 bg-blue-50" : "border-slate-100 hover:border-slate-200")}>
                  <div className="text-sm font-bold">{a.label} ({a.multiplier})</div>
                  <div className="text-xs text-slate-500">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="ml-2 text-xs font-bold uppercase text-slate-400">Твоя ціль</label>
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map(g => (
                <button key={g.id} onClick={() => setGoalId(g.id)} className={cn("p-3 rounded-2xl border-2 font-bold transition-all", goalId === g.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-100 text-slate-500")}>
                  {g.label}
                  <div className="text-[10px] font-normal">{g.adj > 0 ? `+${g.adj}` : g.adj} ккал</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВА ЧАСТИНА: РЕЗУЛЬТАТ */}
        <div className="lg:col-span-5">
          <div className="sticky space-y-6 top-10">
            {result ? (
              <div key={result.calories} className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl shadow-blue-200 animate-in fade-in zoom-in duration-300">
                <p className="mb-2 text-xs font-bold tracking-widest text-center text-blue-400 uppercase">Твоя добова норма</p>
                <h2 className="mb-8 text-6xl font-black text-center">
                  {result.calories} <span className="text-xl font-light text-slate-400">ккал</span>
                </h2>

                <div className="space-y-4">
                  <MacroRow label="Білки" value={result.protein} color="bg-yellow-400" total={result.calories} cal={result.protein * 4} />
                  <MacroRow label="Жири" value={result.fat} color="bg-red-500" total={result.calories} cal={result.fat * 9} />
                  <MacroRow label="Вуглеводи" value={result.carbs} color="bg-blue-400" total={result.calories} cal={result.carbs * 4} />
                </div>

                <div className="pt-6 mt-8 text-center border-t border-slate-800">
                  <p className="text-xs text-slate-500">Базовий метаболізм (BMR): {result.bmr} ккал</p>
                  <p className="text-slate-500 text-[10px] mt-2 leading-relaxed">
                    Розраховано за формулою Катча-МакАрдла на основі сухої маси тіла ({Math.round(parseFloat(weight) * (1 - bodyFat / 100))} кг).
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white p-10 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-400">Заповніть усі дані для розрахунку</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

function MacroRow({ label, value, color, total, cal }) {
  const percent = Math.round((cal / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-bold">
        <span>{label}</span>
        <span>{value}г <span className="ml-1 text-xs font-normal text-slate-500">{percent}%</span></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}