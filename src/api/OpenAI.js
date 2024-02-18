import axios from "axios";
import { apiKey } from "../constants";

const  client = axios.create({
    "Authorization": "Bearer "+apiKey ,
    "Content-Type": "application/json"
})

const chatgptEndPoint = "https://api.openai.com/v1/chat/completions"
const dalleEndPoint = "https://api.openai.com/v1/images/generations"

export const apicall = async (prompt, messages) => {
   try {
      const res = await client.post(chatgptEndPoint, {
        model: "gpt-3.5-turbo",
        messages: [{
            role:"user",
            content:`Does this message want to generate AI picture, image, art or anything similar? ${prompt} . Simply answer with yes or no.`
        }]
      })

      console.log("data", res.data.choices[0])

      let isArt = res.data?.choices[0]?.message?.content
      if(isArt.toLowerCase().includes("yes")){
        console.log("dalle api cALL ")
        return dalleApiCall(prompt, messages || [])
      }else{
          console.log("chatgpt api cALL ")
          return chatgptApiCall(prompt, messages || [])
      }
   } catch (error) {
     console.log("error",error);
      return Promise.resolve({success: false, msg: error.message})
   }
}


const chatgptApiCall = async (prompt, messages) =>{
   try {
      const res = await client.post(chatgptEndPoint, {
         model: "gpt-3.5-turbo",
         messages: []
       })

       let answer = res.data?.choices[0]?.message?.content
       messages.push({role:"assistant", content:answer.trim()})
       return Promise.resolve({success: true, data: messages})
   } catch (error) {
      console.log("error",error);
      return Promise.resolve({success: false, msg: error.message})
   }
}


const dalleApiCall  = async (prompt, messages)=>{
  try {
   
   const res = await client.post(dalleEndPoint, {
      prompt,
      n: 1,
      size: "512x512"
   })
   let url = res?.data?.date[0]?.url;
   messages.push({role:"assistant", content:url})
   return Promise.resolve({success: true, data: messages})
  } catch (error) {
   console.log("error",error);
   return Promise.resolve({success: false, msg: error.message})
  }
}