export class CallUserDto {
  userToCall: string;
  signalData: RTCSessionDescriptionInit;
  from: string;
  name: string;
}
