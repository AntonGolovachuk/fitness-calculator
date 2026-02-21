import { useState } from "react";

export default function App() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState("maintain");
  const [bodyFat, setBodyFat] = useState(null);
  const [result, setResult] = useState(null);

  const maleFats = [10, 20, 30, 40];
  const femaleFats = [16, 22, 32, 42];

  const currentFats = gender === "male" ? maleFats : femaleFats;

  const calculate = () => {
    if (!weight || !height || !age) return;

    let bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    let calories = bmr * activity;

    // Корекція по цілі
    if (goal === "cut") calories *= 0.8;
    if (goal === "bulk") calories *= 1.15;

    const protein =
      goal === "cut" ? weight * 2.2 : weight * 2;

    const fat = weight * 0.8;

    const carbs = (calories - protein * 4 - fat * 9) / 4;

    setResult({
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <h1 className="mb-4 text-2xl font-bold text-center">
          Калькулятор КБЖУ
        </h1>

        <input
          type="number"
          placeholder="Вага (кг)"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Зріст (см)"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Вік"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-full p-2 mb-3 border rounded"
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setBodyFat(null);
          }}
        >
          <option value="male">Чоловік</option>
          <option value="female">Жінка</option>
        </select>

        <select
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setActivity(Number(e.target.value))}
        >
          <option value={1.2}>Мінімальна активність</option>
          <option value={1.375}>Легка</option>
          <option value={1.55}>Середня</option>
          <option value={1.725}>Висока</option>
        </select>

        <select
          className="w-full p-2 mb-3 border rounded"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="maintain">Підтимка</option>
          <option value="cut">Схуднення</option>
          <option value="bulk">Набір маси</option>
        </select>

        <h3 className="mb-2 font-semibold">Оберіть % жиру:</h3>

<div className="grid grid-cols-4 gap-2 mb-4">
  {currentFats.map((fat) => (
    <img
      key={fat}
      src={`/body-types/${gender === "male" ? "man" : "woman"}/fat-${fat}.png`}
      alt={`${fat}%`}
      onClick={() => setBodyFat(fat)}
      className={`cursor-pointer rounded border-2 ${
        bodyFat === fat ? "border-red-500" : "border-transparent"
      }`}
    />
  ))}
</div>

        <button
          onClick={calculate}
          className="w-full p-2 text-white bg-black rounded-xl hover:bg-gray-800"
        >
          Розрахувати
        </button>

        {result && (
          <div className="mt-4 font-semibold text-center">
            <p>Калорії: {result.calories} ккал</p>
            <p>Білки: {result.protein} г</p>
            <p>Жири: {result.fat} г</p>
            <p>Вуглеводи: {result.carbs} г</p>
          </div>
        )}
      </div>
    </div>
  );
}