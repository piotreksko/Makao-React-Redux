import React from "react";
import { shallow } from "enzyme";
import SuitIcon from "./SuitIcon";

describe("SuitIcon", () => {
  const weight = "spades";
  let props;
  let wrapper;
  const component = () => {
    if (!wrapper) {
      wrapper = shallow(<SuitIcon {...props} />);
    }
    return wrapper;
  };

  beforeEach(() => {
    props = {
      show: true,
      gameOver: false,
      chosenWeight: weight
    };
    wrapper = undefined;
  });

  it("does not render when game is over", () => {
    props.gameOver = true;
    const div = component().find("div");
    expect(div.length).toBe(0);
  });

  it("renders a div", () => {
    const div = component().find("div");
    expect(div.length).toBe(1);
  });

  it("renders an image", () => {
    const img = component().find("img");
    expect(img.length).toBe(1);
  });

  it("has given symbol as an image", () => {
    props.chosenWeight = weight;
    const img = component().find("img");
    expect(img.prop("src")).toEqual("spades_symbol.png");
  });

  it('has a "modal-shown" class', () => {
    const div = component().find("div.info-icon");
    expect(div.hasClass("modal-shown"));
  });
});
