// Simplified Tamil Nadu boundary GeoJSON (mock data for demonstration)
export const tamilNaduBoundary = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Tamil Nadu",
        "state_code": "TN"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [76.2673, 11.9144],
          [76.7217, 12.3764],
          [77.8203, 12.9092],
          [78.6269, 13.2846],
          [79.4175, 13.4479],
          [80.1755, 13.0827],
          [80.3463, 12.6186],
          [80.2307, 11.8781],
          [80.0367, 11.3275],
          [79.8275, 10.9570],
          [79.6867, 10.5457],
          [79.3156, 10.3074],
          [78.8842, 9.5411],
          [78.4542, 9.1775],
          [77.9380, 8.7322],
          [77.5367, 8.5389],
          [77.0673, 8.2511],
          [76.6733, 8.3892],
          [76.4364, 8.7084],
          [76.2247, 9.0868],
          [76.1175, 9.8735],
          [76.2956, 10.2764],
          [76.2673, 11.9144]
        ]]
      }
    }
  ]
};

// Mock data generation functions
export const generateMockSoilData = (location: any) => {
  const soilTypes = ['Red Soil', 'Black Soil', 'Alluvial Soil', 'Laterite Soil'];
  const fertilityLevels = ['High', 'Medium', 'Low'];
  
  return {
    type: soilTypes[Math.floor(Math.random() * soilTypes.length)],
    ph: +(6.0 + Math.random() * 2.5).toFixed(1),
    nutrients: 'N-P-K Available',
    fertility: fertilityLevels[Math.floor(Math.random() * fertilityLevels.length)]
  };
};

export const generateMockRainfallData = (location: any) => {
  return {
    annual: Math.floor(600 + Math.random() * 800),
    seasonal: 'Monsoon Dependent',
    reliability: Math.random() > 0.5 ? 'Good' : 'Moderate'
  };
};

export const generateMockNDVIData = (location: any) => {
  return {
    current: +(0.3 + Math.random() * 0.5).toFixed(2),
    trend: Math.random() > 0.6 ? 'Improving' : 'Stable',
    season: 'Post-Monsoon'
  };
};