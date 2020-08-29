import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import "./App.css";

const App = () => {
  const [userJson, setUserJson] = useState("");
  const [prefixText, setPrefixText] = useState("");
  const [originalObject, setOriginalObject] = useState({});
  const [encodedUrl, setEncodedUrl] = useState("");
  const [parsedObject, setParsedObject] = useState({});

  const separator = "+";

  const urlConstructor = (obj, prefix, level = 0) => {
    const str = [];
    const paramConstructor = (k, v) => k + "=" + v;
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        const k = prefix ? `${prefix}${level === 0 ? "" : separator}${p}` : p,
          v = obj[p];
        let pv = null;
        if (v !== null && typeof v !== "undefined") {
          if (Array.isArray(v)) {
            const isSingleLevel = v.every(
              (each) =>
                each && (typeof each === "number" || typeof each === "string"),
            );
            if (isSingleLevel) {
              pv = encodeURIComponent(v);
              str.push(paramConstructor(k, pv));
            }
          } else if (typeof v === "string" || typeof v === "number") {
            str.push(paramConstructor(k, v));
          } else if (typeof v === "object" && Object.keys(v).length > 0) {
            str.push(urlConstructor(v, k, level + 1));
          }
        }
      }
    }
    return str.join("&");
  };

  const objectConstructor = (urlQuery, prefixIn) => {
    const prefix = prefixIn ? `${prefixIn}` : undefined;
    const obj = {};
    const queryString = `${urlQuery}`.split("?").pop();
    const queryObjects = queryString.split("&");
    queryObjects.forEach((value) => {
      const pairArray = value.split("=");
      if (pairArray.length > 1) {
        const k = decodeURIComponent(pairArray[0]);
        const v = decodeURIComponent(pairArray[1]);
        let valuesIn = undefined;
        if ((prefix && k.indexOf(prefix) === 0) || !prefix) {
          const ak = k.split(prefix).pop();
          if (ak && ak !== prefix) {
            const valueArray = `${v}`.split(",");
            valuesIn = valueArray.length < 2 ? valueArray[0] : valueArray;
            const keyArray = `${ak}`.split(separator);
            const keyCount = keyArray.length;
            const rootKey = keyArray[0];
            if (keyCount === 1) {
              if (rootKey) {
                obj[rootKey] = valuesIn;
              }
            } else if (keyCount > 1) {
              let currentActiveObject = valuesIn;
              for (let t = keyCount; t > 0; t--) {
                const eachKey = keyArray[t - 1];
                currentActiveObject = { [eachKey]: currentActiveObject };
              }
              let objKeyIn = obj[rootKey];

              if (
                currentActiveObject &&
                Object.keys(currentActiveObject).length > 0
              ) {
                if (objKeyIn) {
                  const objectMapper = (base, mapper) => {
                    let inMapper = { ...base };
                    if (
                      base &&
                      mapper &&
                      Object.keys(base).length > 0 &&
                      Object.keys(mapper).length > 0
                    ) {
                      const baseKeys = Object.keys(base);
                      Object.keys(mapper).forEach((eachMapperKey) => {
                        if (baseKeys.includes(eachMapperKey)) {
                          const mappedMap = objectMapper(
                            base[eachMapperKey],
                            mapper[eachMapperKey],
                          );
                          inMapper[eachMapperKey] = {
                            ...base[eachMapperKey],
                            ...mappedMap,
                          };
                        } else {
                          inMapper = { ...base, ...mapper };
                        }
                      });
                    } else {
                      inMapper = { ...base, ...mapper };
                    }
                    return inMapper;
                  };
                  obj[rootKey] = {
                    ...objKeyIn,
                    ...currentActiveObject[rootKey],
                  };
                  const mappedObject = objectMapper(
                    objKeyIn,
                    currentActiveObject[rootKey],
                  );
                  obj[rootKey] = {
                    ...obj[rootKey],
                    ...mappedObject,
                  };
                } else {
                  obj[rootKey] = currentActiveObject[rootKey];
                }
              }
            }
          }
        }
      }
    });
    return obj;
  };

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
    const urlIn = urlConstructor(originalObject, prefixText);
    setEncodedUrl(urlIn);
    const objectIn = objectConstructor(urlIn, prefixText);
    setParsedObject(objectIn);
  }, [originalObject, prefixText]);

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

  const prefixChange = (event) => {
    setPrefixText(`${event?.target?.value}`.replace(" ", "_"));
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

          <textarea
            rows="10"
            style={{ width: "90%", height: "50%" }}
            value={encodedUrl}
          ></textarea>
        </div>
        <div style={{ margin: `2rem 0` }}>
          <h3>Decoded</h3>
          <ReactJson src={parsedObject} />
        </div>
      </div>
    </div>
  );
};
export default App;
