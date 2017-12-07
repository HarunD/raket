import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Raket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isConnected: false,
            WS: null
        };

        this.timeoutInterval = 1000;

        this.close = this
            .close
            .bind(this);
    }

    componentDidMount() {
        this.setup();
    }

    componentWillUnmount() {
        this.close();
    }

    log(message) {
        if (this.props.shouldLog) {
            console.log(`Raket | at :  ${new Date().toLocaleTimeString()} | ${message}`);
        }
    }

    setup() {
        this.setState({
            WS: new WebSocket(this.props.url)
        }, () => {
            this.setupLifecycle();
        });
    }

    setupLifecycle() {
        let WS = this.state.WS;

        WS.onopen = () => {
            this.log("WebSocket opening");
            this
                .props
                .onEvent({type: 'open'});
        };

        WS.onclose = (closer) => {
            this.log("WebSocket closing");
            this
                .props
                .onEvent({type: 'close'});

            if (!this.state.WS) {
                // Closed manually
                return;
            }

            if (this.props.shouldReconnect) {
                this.tryToReconnect(closer.reason);
            }
        };

        WS.onmessage = (message) => {
            this.log("WebSocket got message : " + message);
            this
                .props
                .onEvent({type: 'open', payload: message});
        };

        WS.onerror = (error) => {
            this.log("WebSocket has error : " + error);
            this
                .props
                .onEvent({type: 'open', payload: error});
        };
    }

    close() {
        let WS = this.state.WS;
        if (WS) {
            WS.close();
        }
        if (this.TIMEOUT_ID) {
            clearTimeout(this.TIMEOUT_ID);
        }

        this.timeoutInterval = 1000;
        this.setState({isConnected: false, WS: null});
    }

    tryToReconnect(closeReason) {
        this.timeoutInterval = (this.timeoutInterval !== 16000)
            ? this.timeoutInterval * 2
            : this.timeoutInterval;

        this.log(`Websocket connection closed (${closeReason}). Reopening the connection in ${this.timeoutInterval / 1000} seconds ...`);

        this.TIMEOUT_ID = setTimeout(() => {
            this.setup();
        }, this.timeoutInterval);
    }

    render() {
        return '';
    }
}

Raket.defaultProps = {
    shouldLog: false,
    shouldReconnect: false
};

Raket.PropTypes = {
    url: PropTypes.string.isRequired,
    shouldLog: PropTypes.bool,
    shouldReconnect: PropTypes.bool,
    onEvent: PropTypes.func.isRequired
};

export default Raket;