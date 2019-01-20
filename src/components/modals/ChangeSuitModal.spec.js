import React from "react";
import { shallow } from "enzyme";
import ChangeSuitModal from "./ChangeSuitModal";

describe("change suit modal", () => {
  let props;
  let wrapper;
  const mockFn = jest.fn();
  const weights = ["hearts", "diamonds", "clubs", "hearts"];
  const modal = () => {
    if (!wrapper) {
      wrapper = shallow(<ChangeSuitModal {...props} />);
    }
    return wrapper;
  };

  beforeEach(() => {
    props = {
      changeSuit: mockFn
    };
    wrapper = undefined;
  });

  it("renders a div", () => {
    const div = modal().find("div");
    expect(div.length).toBeGreaterThan(0);
  });

  it("should call a function when clicked", () => {
    weights.forEach((weight, idx) => {
      const button = modal()
        .find("button")
        .at(idx);
      button.simulate("click");
      expect(mockFn).toHaveBeenCalledWith(weight);
    });
  });
});
