import React from "react";
import { shallow } from "enzyme";
import Card from "./Card";

describe("Card", () => {
  let props;
  let wrapper;
  const mockFn = jest.fn();
  const component = () => {
    if (!wrapper) {
      wrapper = shallow(<Card {...props} />);
    }
    return wrapper;
  };

  beforeEach(() => {
    props = {
      card: { weight: "spades", type: "ace" },
      index: 3,
      fromPile: undefined,
      clickOwnCard: undefined
    };
    wrapper = undefined;
  });

  it("renders a div", () => {
    const div = component().find("div");
    expect(div.length).toBe(1);
  });

  describe("card classes and styles", () => {
    it('should have "card" class', () => {
      props.cardClass = "topCard selected cardsInHand";
      expect(component().find('div').hasClass("selected"));
    });

    it("should have a background image with a given card", () => {
      props.card = { weight: "spades", type: "ace" };
      expect(component().find('div').props().style).toHaveProperty(
        "backgroundImage",
    'url(ace_of_spades.png)'
      );
    });
  });

  describe("clickability", () => {
    it("should not be clickable", () => {
      const wrapper = component().find("div");
      wrapper.simulate("click");
      expect(mockFn).not.toBeCalled();
    });

    it("should be clickable and give 2 arguments", () => {
      props.clickOwnCard = mockFn;
      const wrapper = component().find("div");
      wrapper.simulate("click");
      expect(mockFn).toHaveBeenCalledWith({ weight: "spades", type: "ace" }, 3);
    });
  });
});
