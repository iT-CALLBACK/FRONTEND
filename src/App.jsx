import { useState } from 'react';

const api = {
  key: 'fc3c754823314f8c95c110825243110',
  base: 'http://api.weatherapi.com/v1/'
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState({});
  const [fadeOut, setFadeOut] = useState(false);
  const [error, setError] = useState('');

  const updateBackground = (localTime) => {
    const hour = new Date(localTime).getHours();

    if (hour >= 5 && hour < 12) {
      document.body.style.background = 'linear-gradient(to right, #FFDD88, #FFAA33)'; // Утро
    } else if (hour >= 12 && hour < 18) {
      document.body.style.background = 'linear-gradient(to right, #4facfe, #00f2fe)'; // День
    } else if (hour >= 18 && hour < 21) {
      document.body.style.background = 'linear-gradient(to right, #FF7E5F, #feb47b)'; // Вечер
    } else {
      document.body.style.background = 'linear-gradient(to right, #0f2027, #203a43, #2c5364)'; // Ночь
      document.body.style.color = '#e0e7ed'; // Цвет текста для ночи
    }
  };

  const search = async (e) => {
    if (e.key !== 'Enter') return;

    setFadeOut(true); // Начинаем анимацию
    setError(''); // Сбрасываем сообщение об ошибке

    try {
      const response = await fetch(
        `${api.base}current.json?key=${api.key}&q=${city}&lang=ru`
      );
      const data = await response.json();

      if (data.error) {
        setError('Город не найден. Попробуйте еще раз.'); // Устанавливаем сообщение об ошибке
        setWeather({});
      } else {
        setWeather(data);
        updateBackground(data.location.localtime); // Обновление фона
      }
      setCity('');
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
      setError('Произошла ошибка. Попробуйте еще раз.'); // Сообщение об ошибке
    } finally {
      setFadeOut(false); // Завершаем анимацию
    }
  };

  const formatDate = (d) => {
    const localDate = new Date(d);
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    const day = days[localDate.getUTCDay()];
    const date = localDate.getUTCDate();
    const month = months[localDate.getUTCMonth()];
    const year = localDate.getUTCFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  return (
    <main>
      <div className='searchBlock'>
        <div className="searchText">
          <h2>Погода</h2>
        </div>
        <div className='searchBox'>
          <input
            type='text'
            className='searchBar'
            placeholder='Поиск...'
            onChange={e => setCity(e.target.value)}
            value={city}
            onKeyPress={search}
          />
        </div>
      </div>
      {error && <div className='error'>{error}</div>} {/* Выводим сообщение об ошибке */}
      {Object.keys(weather).length === 0 && !error && ( // Блок с подсказкой
        <div className='infoBlock'>Введите название города для получения информации о погоде.</div>
      )}
      {Object.keys(weather).length > 0 && weather.current && ( // Условие для отображения блока с погодой
        <div className={`locationBlock ${fadeOut ? 'fadeOut' : 'fadeIn'}`}>
          <div className='locationBox'>
            <div className="icon">
              <img src={weather.current.condition.icon} alt="img" />
            </div>
            <div className='location'>{weather.location.name}</div>
            <div className='date'>{formatDate(weather.location.localtime)}</div>
          </div>
          <div className={`weatherBox ${fadeOut ? 'fadeOut' : 'fadeIn'}`}>
            <div className='temp'>{Math.round(weather.current.temp_c)}°c</div>
            <div className='weather'>{weather.current.condition.text}</div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;