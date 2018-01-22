import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Raket extends Component {
    state = {
        status: 'closed',
        WS: null
    };
    timeoutInterval = 1000;
    statusColors = this.props.statusColors || {
        closed: 'grey',
        open: 'green',
        error: 'red'
    };

    componentDidMount() {
        this.setup();
    }

    componentWillUnmount() {
        this.close();
    }

    componentWillUpdate(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.close();
            this.setup();
        }
    }

    log = message => {
        if (this.props.shouldLog) {
            console.log(`Raket | at :  ${new Date().toLocaleTimeString()} | ${message}`);
        }
    }

    setup = () => {
        this.setState({
            WS: new WebSocket(this.props.url)
        }, () => {
            this.setupLifecycle();
        });
    }

    setupLifecycle = () => {
        let WS = this.state.WS;

        WS.onopen = () => {
            this.log("WebSocket opening");
            this.setState({status: 'open'});
            this
                .props
                .onEvent({type: 'open'});
        };

        WS.onclose = (closer) => {
            this.log("WebSocket closing");
            this.setState({status: 'closed'});
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

    close = () => {
        let WS = this.state.WS;
        if (WS) {
            WS.close();
        }
        if (this.TIMEOUT_ID) {
            clearTimeout(this.TIMEOUT_ID);
        }

        this.timeoutInterval = 1000;
        this.setState({status: 'closed', WS: null});
    }

    tryToReconnect = closeReason => {
        this.timeoutInterval = (this.timeoutInterval !== 16000)
            ? this.timeoutInterval * 2
            : this.timeoutInterval;

        this.log(`Websocket connection closed (${closeReason}). Reopening the connection in ${this.timeoutInterval / 1000} seconds ...`);

        this.TIMEOUT_ID = setTimeout(() => {
            this.setup();
        }, this.timeoutInterval);
    }

    renderIndicatorIcon = () => {
        let {status} = this.state;

        return (
            <div
                className={`RaketIndicator --status-${status} ${this.props.className}`}
                style={this.props.style || {
                backgroundColor: this.statusColors[status],
                borderRadius: '50%',
                bottom: '20px',
                height: '30px',
                left: '20px',
                position: 'absolute',
                zIndex: '5000',
                width: '30px'
            }}></div>
        );
    }

    render() {
        if (!this.props.showIndicator) {
            return '';
        }

        return this.renderIndicatorIcon();
    }
}

Raket.defaultProps = {
    className: '',
    shouldLog: false,
    shouldReconnect: false,
    showIndicator: false,
    statusColors: null,
    style: null
};

Raket.PropTypes = {
    url: PropTypes.string.isRequired,
    shouldLog: PropTypes.bool,
    shouldReconnect: PropTypes.bool,
    onEvent: PropTypes.func.isRequired
};