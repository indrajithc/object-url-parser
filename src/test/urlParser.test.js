import { renderHook } from "@testing-library/react-hooks";
import useUrlParser from "../hooks/useUrlParser";

test("Url Parser Object", () => {
  const {
    result: { current },
  } = renderHook(() => useUrlParser());
  expect(current && typeof current === "object").toBeTruthy();
});

test("Url Parser integration test", () => {
  const {
    result: { current },
  } = renderHook(() => useUrlParser());

  const { objectConstructor, urlConstructor } = current;

  const inputObject = { name: "test" };
  const inputJson = JSON.stringify(inputObject);
  expect(inputJson && typeof inputJson === "string").toBeTruthy();

  const urlQuery = urlConstructor(inputObject);
  expect(urlQuery && typeof inputJson === "string").toBeTruthy();

  const parsedObject = objectConstructor(urlQuery);
  expect(parsedObject && typeof parsedObject === "object").toBeTruthy();

  const parsedObjectJson = JSON.stringify(parsedObject);

  expect(parsedObjectJson === inputJson).toBeTruthy();
});
