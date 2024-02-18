import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../constants';
import Voice from '@react-native-community/voice';
import { apicall } from '../api/OpenAI';


const HomeScreen = () => {
    const [message, setMessage] = useState(dummyMessages)
    const [recording, setRecording] = useState(false)
    const [speaking, setSpeaking] = useState(false)
    const [result, setResult] = useState("")

const clear = () =>{
    setMessage([])
}
const stopSpeaking = () =>{
    setSpeaking(false)
}

const SpeechStartHandler =() =>{
    console.log("speech start handler")
}
const SpeechEndHandler =() =>{
    setRecording(false)
    console.log("speech End handler")
}
const SpeechResultsHandler =(e) =>{
    // const recognizedText = e.value[0];
    // console.log("Recognized text:", recognizedText);
    console.log('Resulthandler')
    setResult("How are you?")

}
const SpeechErrorHandler =(e) =>{
    setRecording(false)
    console.log("Error handler:", e)
}

const startRecording = async () =>{
    setRecording(true)
    try{
       await Voice.start("en-US") // en-US
    }catch(err){
        console.log("err", err)
        setRecording(false);
    } 
}

const stopRecording = async () =>{
    try{
        await Voice.stop()
        setRecording(false)
        // fetch responce
        fetchResponce()
    }catch(err){
        console.log("err", err)
    } 
}

useEffect(()=>{
    console.log('use Effect cal')
    Voice.onSpeechStart = SpeechStartHandler;
    Voice.onSpeechEnd = SpeechEndHandler
    Voice.onSpeechResults = SpeechResultsHandler
    Voice.onSpeechError = SpeechErrorHandler

    return () =>{
        // destroy the voice instance
        Voice.destroy().then(Voice.removeAllListeners)
        console.log('Event listeners removed');

    }

},[recording])

const fetchResponce = () =>{
  if(result.trim().length>0){
    let newMessages = [...message]
    newMessages.push({role:"user", content:result.trim()})
    setMessage([...newMessages])

    apicall(result.trim(), newMessages).then(res=>{
        console.log("api data" )
        if(res.success){
            setMessage([...res.data])
            setResult('')
        }else{
            Alert.alert('Error')
        }
    })
  }
}




    return (
        <View className="flex-1 bg-white">
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>
            <SafeAreaView className="flex-1 flex mx-5">
                {/* bot icon */}
                <View className="flex-row justify-center">
                    <Image source={require("../../assets/images/bot.png")} style={{ width: hp(20), height: hp(20) }} />
                </View>
                {/* features || message */}
                {
                    message.length > 0 ? (
                        <View className="space-y-2 flex-2 ">
                            <Text style={{ fontSize: wp(5) }} className="text-gray-700 font-semibold ml-1">Assistant</Text>
                            <View style={{ height: hp(58) }} className="bg-neutral-200 rounded-3xl p-4">
                                <ScrollView bounces={false} className="space-y-4" showsVerticalScrollIndicator={false}>
                                    {
                                        message.map((message, index) => {
                                            if (message.role == "assistant") {
                                                if (message.content.includes("http")) {
                                                    // its an ai image
                                                    return (
                                                        <View key={index} className="flex-row justify-start">
                                                            <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                                                                <Image source={{ uri: message.content }} className="rounded-2xl" resizeMode='contain' style={{ height: wp(60), width: wp(60) }} />
                                                            </View>
                                                        </View>
                                                    )
                                                } else {
                                                    //   text responce
                                                    return (
                                                        <View key={index} style={{ width: wp(70) }} className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                                                            <Text className="text-gray-700">{message.content}</Text>
                                                        </View>
                                                    )
                                                }
                                            } else {
                                                // user input
                                                return (
                                                    <View key={index} className="flex-row justify-end ">
                                                        <View style={{ width: wp(70) }} className="bg-white rounded-xl p-2 rounded-tr-none">
                                                            <Text className="text-gray-700">{message.content}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            }
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    ) : (
                        <Features />
                    )
                }
                {/* recordin, clear messages, stop buttons */}
                <View className="flex justify-center items-center mt-3">

                    {
                        recording ? (
                            <TouchableOpacity onPress={stopRecording}>
                                <Image className="rounded-full" source={require("../../assets/images/voiceLoading.gif")} style={{ height: hp(10), width: hp(10) }} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={startRecording}>
                                <Image className="rounded-full" source={require("../../assets/images/recordingIcon.png")} style={{ height: hp(10), width: hp(10) }} />
                            </TouchableOpacity>
                        )
                    }
                   {
                      message.length>0 && (
                         <TouchableOpacity onPress={clear} className="bg-neutral-400 rounded-3xl p-2 absolute right-10">
                         <Text className="text-white font-semibold">Clear</Text>
                         </TouchableOpacity>
                      )

                   }
                   {
                      speaking && (
                         <TouchableOpacity onPress={stopSpeaking} className="bg-red-400 rounded-3xl p-2 absolute left-10">
                         <Text className="text-white font-semibold">Stop</Text>
                         </TouchableOpacity>
                      )

                   }

                </View>
            </SafeAreaView>
        </View>
    )
}

export default HomeScreen