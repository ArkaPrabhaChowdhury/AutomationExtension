import React, { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import loader from "./assets/Rolling-1s-75px.gif";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, isLoading] = useState(false);
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const generateText = async () => {
    const lowerSentence = prompt.toLowerCase();

    // Check if the sentence contains the desired phrases
    const containsLogACall = lowerSentence.includes("log a call");
    const containsLogCall = lowerSentence.includes("log call");

    event.preventDefault();
    isLoading(true);
    const response = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `Find the unique entities for the below text and return them in a fixed JSON format with unique types inside entities array:\n${prompt}`,
        temperature: 0.0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.22,
        presence_penalty: 0,
      })
      .then((response) => {
        const parsed = JSON.parse(response.data.choices[0].text);
        console.log(parsed);
        if (
          parsed.entities[1].type == "Organization" ||
          parsed.entities[1].type == "organization"
        ) {
          const person = parsed.entities[0].value;
          const company = parsed.entities[1].value;
          isLoading(false);
          console.log(person, company);
          try {
            const result = axios.post("http://localhost:4000/person", {
              person,
              company,
            });
            console.log(result);
            isLoading(false);
          } catch (err) {
            console.log(err);
          }
        } else if (containsLogACall || containsLogCall) {
          const person = parsed.entities[0].value;
          const sayingIndex = prompt.toLowerCase().indexOf("saying that");

          // Extract the words after "saying that"
          let comment = "";
          if (sayingIndex !== -1 && sayingIndex + 11 < prompt.length) {
            comment = prompt.substring(sayingIndex + 11).trim();

            // Find the index of the first space after "saying that"
            const firstSpaceIndex = comment.indexOf(" ");

            if (firstSpaceIndex !== -1) {
              // Extract the words after the first space
              comment = comment.substring(firstSpaceIndex + 1);
            }
          }
          try {
            const result = axios.post("http://localhost:4000/call", {
              person,
              comment,
            });
            console.log(result);
            isLoading(false);
          } catch (err) {
            console.log(err);
          }
        } else {
          const parsed = JSON.parse(response.data.choices[0].text);
          console.log(parsed);

          if (parsed.entities && parsed.entities.length > 0) {
            const location = parsed.entities.find(
              (entity) =>
                entity.type === "location" || entity.type === "Location"
            )?.value;
            const people = parsed.entities.find(
              (entity) =>
                entity.type === "number" ||
                entity.type === "Number" ||
                entity.type === "number_of_people" ||
                entity.type === "NumberOfPeople" ||
                entity.type === "Number of People"
            )?.value;
            const price = parsed.entities.find(
              (entity) =>
                entity.type === "price" ||
                entity.type === "Price" ||
                entity.type === "Budget"
            )?.value;
            console.log(location, people, price);
            try {
              const result = axios.post("http://localhost:4000/house", {
                location,
                people,
                price,
              });
            isLoading(false);
            } catch (e) {
              console.log(e);
            }
          } else {
            console.log("No entities found in the data.");
          }
        }
      });
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };
  return loading ? (
    <img src={loader} />
  ) : (
    <>
      <form onSubmit={generateText}>
        <h2>AI Task Automator</h2>
        <div>
          <textarea
            rows="5"
            cols="25"
            placeholder="Enter prompt"
            type="text"
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                generateText();
              }
            }}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
