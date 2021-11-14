// below data is taken from https://github.com/country-regions/country-region-data

const countryAndState = [
  {
    country: 'India',
    countryValue: 'india',
    states: ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal']
  },
  {
    country: 'United States',
    countryValue: 'usa',
    states: ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Armed Forces Americas', 'Armed Forces Europe, Canada, Africa and Middle East', 'Armed Forces Pacific']
  },
  {
    country: 'United Kingdom',
    countryValue: 'uk',
    states: ['Aberdeen City', 'Aberdeenshire', 'Angus', 'Antrim and Newtownabbey', 'Ards and North Down', 'Argyll and Bute', 'Armagh,  Banbridge and Craigavon', 'Barking and Dagenham', 'Barnet', 'Barnsley', 'Bath and North East Somerset', 'Bedford', 'Belfast', 'Bexley', 'Birmingham', 'Blackburn with Darwen', 'Blackpool', 'Blaenau Gwent', 'Bolton', 'Bournemouth', 'Bracknell Forest', 'Bradford', 'Brent', 'Bridgend', 'Brighton and Hove', 'Bristol,  City of', 'Bromley', 'Buckinghamshire', 'Bury', 'Caerphilly', 'Calderdale', 'Cambridgeshire', 'Camden', 'Cardiff', 'Carmarthenshire', 'Causeway Coast and Glens', 'Central Bedfordshire', 'Ceredigion', 'Cheshire East', 'Cheshire West and Chester', 'Clackmannanshire', 'Conwy', 'Cornwall', 'Coventry', 'Croydon', 'Cumbria', 'Darlington', 'Denbighshire', 'Derby', 'Derbyshire', 'Derry and Strabane', 'Devon', 'Doncaster', 'Dorset', 'Dudley', 'Dumfries and Galloway', 'Dundee City', 'Durham County', 'Ealing', 'East Ayrshire', 'East Dunbartonshire', 'East Lothian', 'East Renfrewshire', 'East Riding of Yorkshire', 'East Sussex', 'Edinburgh,  City of', 'Eilean Siar', 'Enfield', 'Essex', 'Falkirk', 'Fermanagh and Omagh', 'Fife', 'Flintshire', 'Gateshead', 'Glasgow City', 'Gloucestershire', 'Greenwich', 'Gwynedd', 'Hackney', 'Halton', 'Hammersmith and Fulham', 'Hampshire', 'Haringey', 'Harrow', 'Hartlepool', 'Havering', 'Herefordshire', 'Hertfordshire', 'Highland', 'Hillingdon', 'Hounslow', 'Inverclyde', 'Isle of Anglesey', 'Isle of Wight', 'Isles of Scilly', 'Islington', 'Kensington and Chelsea', 'Kent', 'Kingston upon Hull', 'Kingston upon Thames', 'Kirklees', 'Knowsley', 'Lambeth', 'Lancashire', 'Leeds', 'Leicester', 'Leicestershire', 'Lewisham', 'Lincolnshire', 'Lisburn and Castlereagh', 'Liverpool', 'London,  City of', 'Luton', 'Manchester', 'Medway', 'Merthyr Tydfil', 'Merton', 'Mid and East Antrim', 'Mid Ulster', 'Middlesbrough', 'Midlothian', 'Milton Keynes', 'Monmouthshire', 'Moray', 'Neath Port Talbot', 'Newcastle upon Tyne', 'Newham', 'Newport', 'Newry,  Mourne and Down', 'Norfolk', 'North Ayrshire', 'North East Lincolnshire', 'North Lanarkshire', 'North Lincolnshire', 'North Somerset', 'North Tyneside', 'North Yorkshire', 'Northamptonshire', 'Northumberland', 'Nottingham', 'Nottinghamshire', 'Oldham', 'Orkney Islands', 'Oxfordshire', 'Pembrokeshire', 'Perth and Kinross', 'Peterborough', 'Plymouth', 'Poole', 'Portsmouth', 'Powys', 'Reading', 'Redbridge', 'Redcar and Cleveland', 'Renfrewshire', 'Rhondda,  Cynon,  Taff', 'Richmond upon Thames', 'Rochdale', 'Rotherham', 'Rutland', 'St. Helens', 'Salford', 'Sandwell', 'Scottish Borders,  The', 'Sefton', 'Sheffield', 'Shetland Islands', 'Shropshire', 'Slough', 'Solihull', 'Somerset', 'South Ayrshire', 'South Gloucestershire', 'South Lanarkshire', 'South Tyneside', 'Southampton', 'Southend-on-Sea', 'Southwark', 'Staffordshire', 'Stirling', 'Stockport', 'Stockton-on-Tees', 'Stoke-on-Trent', 'Suffolk', 'Sunderland', 'Surrey', 'Sutton', 'Swansea', 'Swindon', 'Tameside', 'Telford and Wrekin', 'Thurrock', 'Torbay', 'Torfaen', 'Tower Hamlets', 'Trafford', 'Vale of Glamorgan,  The', 'Wakefield', 'Walsall', 'Waltham Forest', 'Wandsworth', 'Warrington', 'Warwickshire', 'West Berkshire', 'West Dunbartonshire', 'West Lothian', 'West Sussex', 'Westminster', 'Wigan', 'Wiltshire', 'Windsor and Maidenhead', 'Wirral', 'Wokingham', 'Wolverhampton', 'Worcestershire', 'Wrexham', 'York']
  },
  {
    country: 'Canada',
    countryValue: 'canada',
    states: ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon']
  },
  {
    country: 'Jamaica',
    countryValue: 'jamaica',
    states: ['Clarendon', 'Hanover', 'Kingston', 'Manchester', 'Portland', 'Saint Andrew', 'Saint Ann', 'Saint Catherine', 'Saint Elizabeth', 'Saint James', 'Saint Mary', 'Saint Thomas', 'Trelawny', 'Westmoreland']
  },
  {
    country: 'Australia',
    countryValue: 'australia',
    states: ['Australian Capital Territory', 'New South Wales', 'Northern Territory', 'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia']
  },
  {
    country: 'Singapore',
    countryValue: 'singapore',
    states: ['Central Singapore', 'North East', 'North West', 'South East', 'South West']
  },
  {
    country: 'Bangladesh',
    countryValue: 'bangladesh',
    states: ['Barisal', 'Chittagong', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet']
  },
  {
    country: 'Qatar',
    countryValue: 'qatar',
    states: ['Ad Dawḩah', 'Al Khawr wa adh Dhakhīrah', 'Al Wakrah', 'Ar Rayyān', 'Ash Shamāl', 'Az̧ Za̧`āyin', 'Umm Şalāl']
  },
  {
    country: 'United Arab Emirates',
    countryValue: 'uae',
    states: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras al Khaimah', 'Sharjah', 'Umm Al Quwain']
  },
  {
    country: 'Oman',
    countryValue: 'oman',
    states: ['Ad Dakhiliyah', 'Al Buraymi', 'Al Wusta', 'Az Zahirah', 'Janub al Batinah', 'Janub ash Sharqiyah', 'Masqat', 'Musandam', 'Shamal al Batinah', 'Shamal ash Sharqiyah', 'Zufar']
  },
  {
    country: 'Kuwait',
    countryValue: 'kuwait',
    states: ['Al Aḩmadi', 'Al Farwānīyah', 'Al Jahrā’', 'Al ‘Āşimah', 'Ḩawallī', 'Mubārak al Kabir']
  },
  {
    country: 'Egypt',
    countryValue: 'egypt',
    states: ['Alexandria', 'Aswan', 'Asyout', 'Bani Sueif', 'Beheira', 'Cairo', 'Daqahlia', 'Dumiat', 'El Bahr El Ahmar', 'El Ismailia', 'El Suez', 'El Wadi El Gedeed', 'Fayoum', 'Gharbia', 'Giza', 'Helwan', 'Kafr El Sheikh', 'Luxor', 'Matrouh', 'Menia', 'Menofia', 'North Sinai', 'Port Said', 'Qalubia', 'Qena', 'Sharqia', 'Sixth of October', 'Sohag', 'South Sinai']
  }
]

export default countryAndState
