/*
 * Copyright(c) 2020 Mozanta Technologies Private Ltd.
 *
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of Mozanta ("Confidential
 * Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the contract agreement you entered into with Mozanta.
 *
 * @author Indrajith C
 */
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import useUrlParser from "../hooks/useUrlParser";

export default () => {
  const urlParser = useUrlParser();

  const [userJson, setUserJson] = useState("");
  const [prefixText, setPrefixText] = useState("");
  const [originalObject, setOriginalObject] = useState({});
  const [encodedUrl, setEncodedUrl] = useState("");

  useEffect(() => {
    const myObject = {
      brand: ["b1", "b 2", "b3"],
      price: {
        min: 0,
        max: 12,
        available: {
          ami: 12,
          ama: 100,
          lev: {
            ddd: "dd",
            kkk: "fgg",
          },
        },
      },
      category: ["c1", "c2", "c3"],
      sort: "asc",
      size: "12",
      page: "1",
    };
    setOriginalObject(myObject);
    setUserJson(JSON.stringify(myObject));
  }, []);

  useEffect(() => {
    const urlIn = urlParser.urlConstructor(originalObject, prefixText);
    setEncodedUrl(urlIn);
  }, [originalObject, prefixText]);

  const prefixChange = (event) => {
    setPrefixText(`${event?.target?.value}`.replace(" ", "_"));
  };

  const setNewObject = (event) => {
    if (event && event.target) {
      const { value } = event.target;
      try {
        const isObj = JSON.parse(value);
        setOriginalObject(isObj);
      } catch (error) {}
      setUserJson(value);
    }
  };

  const browseUrl = () => {
    urlParser.push({
      pathname: "/about",
      query: originalObject,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4 style={{ margin: "auto" }}>
          User input <small>update json </small>
        </h4>
        <input
          type="text"
          value={prefixText}
          onChange={prefixChange}
          style={{
            width: "40%",
            margin: "auto",
          }}
          placeholder="prefix"
        />
        <textarea
          rows="2"
          style={{ width: "60%", margin: "auto" }}
          value={userJson}
          onChange={setNewObject}
        ></textarea>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // flexDirection: "column",
        }}
      >
        <div style={{ margin: `2rem 0` }}>
          <h3>Original</h3>
          <ReactJson src={originalObject} />
        </div>
        <div style={{ margin: `1rem 0` }}>
          <h3>Url</h3>
          <button onClick={browseUrl}> browse url</button>
          <textarea
            rows="10"
            style={{ width: "90%", height: "50%" }}
            value={encodedUrl}
          ></textarea>
        </div>
      </div>
    </div>
  );
};
