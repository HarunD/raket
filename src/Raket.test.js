import React from 'react';
import {shallow} from 'enzyme';
import {Server} from 'mock-socket';

import Raket from './Raket';

const TEST_URL_VALID = 'ws://demos.kaazing.com/echo';
const TEST_URL_INVALID = 'ws://thisIsInvalid';

describe("Raket", () => {
    it("should not render Raket component without any props", () => {
        const mockServer = new Server('ws://test');
        expect(Raket.props).toEqual(undefined);
    });

    it("should not connect with invalid URL and onEvent provided", () => {
        let isOpen = false;
        const RaketValid = shallow(<Raket
            url={TEST_URL_INVALID}
            onEvent={(e) => {
            if (e.type === 'open') 
                isOpen = true;
            if (e.type === 'close') 
                isOpen = false;
            }}/>);

        setTimeout(() => {
            expect(RaketValid.state().isConnected).toEqual(false);
            expect(isOpen).toEqual(false);
        }, 200);
    });

    it("should connect with valid URL and onEvent provided", () => {
        let isOpen = false;
        const RaketValid = shallow(<Raket
            url={TEST_URL_VALID}
            onEvent={(e) => {
            if (e.type === 'open') 
                isOpen = true;
            if (e.type === 'close') 
                isOpen = false;
            }}/>);

        setTimeout(() => {
            expect(RaketValid.state().isConnected).toEqual(true);
            expect(isOpen).toEqual(true);
        }, 200);
    });

    it("should close and disconnect on unmount", () => {
        let isOpen = false;
        const RaketValid = shallow(<Raket
            url={TEST_URL_VALID}
            onEvent={(e) => {
            if (e.type === 'open') 
                isOpen = true;
            if (e.type === 'close') 
                isOpen = false;
            }}
            onClose={() => {
            isOpen = false;
        }}/>);

        setTimeout(() => {
            RaketValid.unmount();
            expect(RaketValid.state().isConnected).toEqual(false);
            expect(isOpen).toEqual(true);
        }, 400);
    });

    it("should close and disconnect when closed manually", () => {
        let isOpen = false;
        const RaketValid = shallow(<Raket
            url={TEST_URL_VALID}
            onEvent={(e) => {
            if (e.type === 'open') 
                isOpen = true;
            if (e.type === 'close') 
                isOpen = false;
            }}/>);

        setTimeout(() => {
            RaketValid
                .instance()
                .close();
            expect(RaketValid.state().isConnected).toEqual(false);
            expect(isOpen).toEqual(false);
        }, 400);
    });
});