import LocationOnIcon from '@mui/icons-material/LocationOn'; // Gps icon
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Calendar icon
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Hot weather icon
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Cold weather icon
import CloudIcon from '@mui/icons-material/Cloud'; // Moderate weather icon

const MainWeather = ({ weatherData }) => {

  const temperatureCelsius = weatherData?.main?.temp
  ? Math.round(weatherData.main.temp) : "N/A";
  const weatherDescription = weatherData?.weather?.[0]?.description || "N/A";
  const cityName = weatherData?.name || "City not available";
  const countryName = weatherData?.sys?.country || "Country not available";
  const timestamp = weatherData?.dt || null;

  const currentDate = timestamp
    ? new Date(timestamp * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })
    : "Date not available";

    const renderTemperatureIcon = () => {
      const iconStyle = { marginLeft: '10px', fontSize: '3rem' };
    
      if (temperatureCelsius > 23) {
        return <WbSunnyIcon style={{ ...iconStyle, color: 'orange' }} />;
      } else if (temperatureCelsius < 10) {
        return <AcUnitIcon style={{ ...iconStyle, color: 'blue' }} />;
      } else {
        return <CloudIcon style={{ ...iconStyle, color: 'gray' }} />;
      }
    };
    

    return (
      <div style={{ backgroundColor: '#4B5563', color: 'white', borderRadius: '0.5rem',width:'300px',padding:'30px' }}>
        <div style={{fontSize:'30px'}}>Now</div>
      <div style={{display: 'flex', alignItems: 'center', fontSize: '35px', fontWeight: 'bold'  }}>
        {temperatureCelsius}°C
        {renderTemperatureIcon()}
        
        </div>
      <div style={{ fontSize: '15px', marginTop: '8px',fontWeight:'50' }}>  {weatherDescription}</div>
      <div style={{ marginTop: '1rem' }}>
      <div style={{display:'flex',alignItems:'center'}}>
       <CalendarMonthIcon/> 
        {currentDate}</div>
      <div style={{marginTop:'4px',display:'flex',alignItems:'center'}}>
      <LocationOnIcon/>
        {cityName}, {countryName}</div>
      </div>
      </div>
    );
  };
  
  export default MainWeather;
  