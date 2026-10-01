const axios = require("axios");


const geocode = async (location)=>{

    try{


        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {

                params:{
                    q: location,
                    format:"json"
                },

                headers:{
                    "User-Agent":"wanderlust-app"
                }

            }
        );



        if(response.data.length === 0){

            return null;

        }




        const place = response.data[0];



        return {


            longitude:Number(place.lon),


            latitude:Number(place.lat)



        };



    }
    catch(err){

        console.log("Geocode error:",err);

        return null;

    }


};



module.exports = geocode;