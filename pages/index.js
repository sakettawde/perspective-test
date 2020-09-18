import Head from "next/head"
import { useState } from "react"
import { ResponsiveRadar } from "@nivo/radar"

const styles = {}

export default function Home() {
  const [text, setText] = useState(
    "How dare you say that! You devil!"
  )
  const [chartData, setChartData] = useState([])
  const [rawResponse, setRawResponse] = useState({})

  const askPerspective = () => {
    const data = {
      text,
    }

    fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((result) => result.json())
      .then((result) => {
        // console.log(result)
        setRawResponse(result)
        calculateResponse(result?.data?.attributeScores)
      })
  }

  const calculateResponse = (response) => {
    if (response) {
      console.log(response)
      const chartData = []
      // [{property:"TOXICITY",value:""}]
      for (const property in response) {
        // console.log(`${property}: ${object[property]}`);
        chartData.push({
          property: property,
          value: response[property].summaryScore.value,
        })
      }
      setChartData(chartData)
    }
  }

  const textHandler = (e) => {
    setText(e.target.value)
  }

  const options = {
    chart: {
      height: 350,
      type: "radar",
    },
    title: {
      text: "Basic Radar Chart",
    },
    xaxis: {
      categories: chartData.map((item) => item.property),
    },
  }

  const series = [
    {
      name: "Series 1",
      data: chartData.map((item) => item.value),
    },
  ]

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css"
        ></link>
      </Head>

      <h1>
        Welcome to <span style={{ color: "#0070f3" }}>AI Lab&nbsp;</span><span style={{fontSize:14}}>(Ahem... fake name)</span>
      </h1>
      <hr />
      <p>Get started by adding a comment and clicking the button</p>
      <hr />
      <h3>Input Text</h3>
      <textarea value={text} onChange={textHandler}></textarea>
      <button
        onClick={askPerspective}
        style={{ backgroundColor: "#0070f3", color: "#fff" }}
      >
        See what the AI thinks?
      </button>
      <hr />
      <div>
        <label>Spider/Radar Chart</label>
      </div>
      <div style={{ height: 560 }}>
        <ResponsiveRadar
          data={chartData}
          keys={["value"]}
          indexBy="property"
          maxValue="auto"
          margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
          curve="linearClosed"
          borderWidth={2}
          borderColor={{ from: "color" }}
          gridLevels={5}
          gridShape="circular"
          gridLabelOffset={36}
          enableDots={true}
          dotSize={10}
          dotColor={{ theme: "background" }}
          dotBorderWidth={2}
          dotBorderColor={{ from: "color" }}
          enableDotLabel={true}
          dotLabel="value"
          dotLabelYOffset={-12}
          colors={{ scheme: "nivo" }}
          fillOpacity={0.25}
          blendMode="multiply"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          isInteractive={true}
          legends={[
            {
              anchor: "top-left",
              direction: "column",
              translateX: -50,
              translateY: -40,
              itemWidth: 80,
              itemHeight: 20,
              itemTextColor: "#999",
              symbolSize: 12,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#000",
                  },
                },
              ],
            },
          ]}
        />
      </div>
      <hr/>
      <div>
        <label>Output</label>
      </div>
      <div>
        <code>{JSON.stringify(rawResponse)}</code>
      </div>
      <hr />
      <div>
        <span>
          Powered by the&nbsp;
          <a href="https://www.perspectiveapi.com/">Perspective API</a>
        </span>
      </div>
      <div>
        <span>
          Made by <a href="https://www.twitter.com/saketcodes">Saket Tawde</a>
        </span>
      </div>
    </>
  )
}
