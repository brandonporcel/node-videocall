import { Controller, Param, Get } from '@nestjs/common';
import { Auth } from '@auth/decorators/auth.decorator';
import { CallService } from './call.service';

@Controller('calls')
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Get(':callId')
  @Auth()
  getCall(@Param('callId') callId: string) {
    return this.callService.getUserCallByCallId(callId);
  }
}
