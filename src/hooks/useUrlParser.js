/**
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

import { useHistory } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";

const useUrlParser = (inputs) => {
  const urlQuery = (inputs && inputs.urlQuery) || "";
  const separator = (inputs && inputs.separator) || "+";
  const prefix = (inputs && inputs.prefix) || undefined;

  const history = useHistory();
  const queryString =
    urlQuery || (history && history.location && history.location.search) || "";
  let thisObject = {};
  const [urlObject, setUrlObject] = useState({});

  /**
   * This function is used to parse object into url
   * @param {Object} obj
   * @param {String} pfx
   * @param {Number} l
   */
  const urlConstructor = (o, pfx = prefix, l = 0) => {
    const s = [];
    try {
      const pc = (k, v) => k + "=" + v;
      for (const p in o) {
        if (o.hasOwnProperty(p)) {
          const k = pfx ? `${pfx}${l === 0 ? "" : separator}${p}` : p,
            v = o[p];
          let pv = null;
          if (v !== null && typeof v !== "undefined") {
            if (Array.isArray(v)) {
              const isl = v.every(
                (each) =>
                  each &&
                  (typeof each === "number" || typeof each === "string"),
              );
              if (isl) {
                pv = encodeURIComponent(v);
                s.push(pc(k, pv));
              }
            } else if (typeof v === "string" || typeof v === "number") {
              s.push(pc(k, v));
            } else if (typeof v === "object" && Object.keys(v).length > 0) {
              s.push(urlConstructor(v, k, l + 1));
            }
          }
        }
      }
    } catch (error) {}
    return s.join("&");
  };

  /**
   * this function is ud to construct object from url
   * @param {String} ua
   * @param {String} pi
   */
  const objectConstructor = useCallback(
    (ua, pi = prefix) => {
      const obj = {};
      try {
        const pfx = pi ? `${pi}` : undefined;
        const qryStr = `${ua}`.split("?").pop();
        const qbo = qryStr.split("&");
        qbo.forEach((val) => {
          const par = val.split("=");
          if (par.length > 1) {
            const k = decodeURIComponent(par[0]);
            const v = decodeURIComponent(par[1]);
            let vIn = undefined;
            if ((pfx && k.indexOf(pfx) === 0) || !pfx) {
              const ak = k.split(pfx).pop();
              if (ak && ak !== pfx) {
                const vr = `${v}`.split(",");
                vIn = vr.length < 2 ? vr[0] : vr;
                const ka = `${ak}`.split(separator);
                const kc = ka.length;
                const rk = ka[0];
                if (kc === 1) {
                  if (rk) {
                    obj[rk] = vIn;
                  }
                } else if (kc > 1) {
                  let cao = vIn;
                  for (let t = kc; t > 0; t--) {
                    const eachKey = ka[t - 1];
                    cao = { [eachKey]: cao };
                  }
                  let objKeyIn = obj[rk];

                  if (cao && Object.keys(cao).length > 0) {
                    if (objKeyIn) {
                      const oM = (b, m) => {
                        let im = { ...b };
                        if (
                          b &&
                          m &&
                          Object.keys(b).length > 0 &&
                          Object.keys(m).length > 0
                        ) {
                          const bk = Object.keys(b);
                          Object.keys(m).forEach((emk) => {
                            if (bk.includes(emk)) {
                              const mm = oM(b[emk], m[emk]);
                              im[emk] = {
                                ...b[emk],
                                ...mm,
                              };
                            } else {
                              im = { ...b, ...m };
                            }
                          });
                        } else {
                          im = { ...b, ...m };
                        }
                        return im;
                      };
                      obj[rk] = {
                        ...objKeyIn,
                        ...cao[rk],
                      };
                      const mo = oM(objKeyIn, cao[rk]);
                      obj[rk] = {
                        ...obj[rk],
                        ...mo,
                      };
                    } else {
                      obj[rk] = cao[rk];
                    }
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        obj.error = error;
      }
      return obj;
    },
    [prefix, separator],
  );

  /**
   * This function is to change route
   * @param {Object} oi
   */
  const localPush = (oi) => {
    try {
      let rs = { ...oi };
      let search = "";
      if (oi) {
        const { query, ...rest } = oi;
        if (
          query &&
          typeof query === "object" &&
          Object.keys(query).length > 0
        ) {
          search = urlConstructor(query) || "";
          rs = rest;
        }
      }
      history.push({
        ...rs,
        search,
      });
    } catch (error) {}
  };

  /**
   * This function is to replace route
   * @param {Object} oi
   */
  const localReplace = (oi) => {
    try {
      let search = "";

      if (
        oi &&
        oi.query &&
        typeof oi.query === "object" &&
        Object.keys(oi.query).length > 0
      ) {
        search = urlConstructor(oi) || "";
      }
      history.replace({
        ...oi,
        search,
      });
    } catch (error) {}
  };

  // setting functions in hook component
  thisObject.objectConstructor = objectConstructor;
  thisObject.urlConstructor = urlConstructor;

  useEffect(() => {
    try {
      if (queryString) {
        const search = `${queryString}`.split("?").pop();
        if (search) {
          setUrlObject({
            object: objectConstructor(search),
          });
        }
      }
    } catch (error) {
      setUrlObject({ error });
    }
  }, [queryString, objectConstructor]);

  try {
    thisObject.push = localPush;
  } catch (error) {
    thisObject.error = error;
  }

  try {
    thisObject.replace = localReplace;
  } catch (error) {
    thisObject.error = error;
  }

  return { ...thisObject, ...urlObject };
};

export default useUrlParser;
