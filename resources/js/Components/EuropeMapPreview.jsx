import { ComposableMap, ZoomableGroup, Geographies, Geography, Marker } from 'react-simple-maps';

const EuropeMapPreview = ({ 
  europeTopoJSON,
  correctlyGuessed = [], 
  semiCorrectGuessed = [], 
  failedGuessedCountries = [],
  countries = []
}) => {
  if (!europeTopoJSON) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="w-full h-[400px] relative"> {/* Smaller fixed */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [10, 45], scale: 500 }}
        style={{ 
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
      >
        <ZoomableGroup
          zoom={1}
          minZoom={1}
          maxZoom={5} 
          translateExtent={[[100, -300], [700, 480]]} 
          center={[10, 45]}
        >
          <Geographies geography={europeTopoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name;
                const isGuessed = correctlyGuessed.includes(name);
                const isSemiGuessed = semiCorrectGuessed.includes(name);
                const isFailedGuess = failedGuessedCountries.includes(name);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isGuessed
                          ? '#4CAF50'
                          : isSemiGuessed
                          ? '#FFD700'
                          : isFailedGuess
                          ? '#FF5733'
                          : '#D6D6DA',
                        stroke: '#5a5c5f',
                        strokeWidth: 0.6,
                        outline: 'none',
                        transition: 'fill 0.2s ease'
                      },
                      hover: {
                        fill: isGuessed
                          ? '#4CAF50'
                          : isSemiGuessed
                          ? '#FFD700'
                          : isFailedGuess
                          ? '#FF5733'
                          : '#cdcdcd', /* Same hover color as Europe.jsx */
                        stroke: '#5a5c5f',
                        strokeWidth: 1,
                        outline: 'none',
                        
                      },
                      pressed: {
                        fill: isGuessed
                          ? '#4CAF50'
                          : isSemiGuessed
                          ? '#FFD700'
                          : isFailedGuess
                          ? '#FF5733'
                          : '#E42E', /* Same pressed color as Europe.jsx */
                        outline: 'none'
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>

          {countries.map((country, index) => (
            <Marker key={index} coordinates={country.coordinates}>
              <circle 
                r={1.7} 
                fill="#FF5733" 
                stroke="#fff" 
                strokeWidth={0.7}
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default EuropeMapPreview;