export type DeviceViewModel = {
    /**
     * ip - IP address of device during signing in
     * title - Device name: for example Chrome 105 (received by parsing http header "user-agent")
     * lastActiveDate - Date of the last generating of refresh/access tokens
     * deviceID - Id of connected device session
     **/

    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}