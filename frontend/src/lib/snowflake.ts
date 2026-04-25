import Long from 'long';

export class SnowFlakeId {
  private readonly machineBits = 10;
  private readonly sequenceBits = 8;

  // 6 feb 2026 - 18:46
  private start = Long.fromString('1770383795974');

  private lastTimestamp = Long.ZERO;
  private counter = Long.ZERO;
  private maxCount = Long.fromInt(1).shiftLeft(this.sequenceBits);
  private machineId: Long;

  public constructor(machineId: number) {
    this.machineId = Long.fromInt(machineId);
  }

  private currentTimestamp(): Long {
    return Long.fromNumber(Date.now());
  }

  public generate(): string {
    let timestamp = this.currentTimestamp();

    if (timestamp.equals(this.lastTimestamp)) {
      this.counter = this.counter.add(1);

      if (this.counter.greaterThan(this.maxCount)) {
        while (timestamp.lessThanOrEqual(this.lastTimestamp)) {
          timestamp = this.currentTimestamp();
        }
      }
    } else {
      this.counter = Long.ZERO;
    }

    // (timestamp - start) << machineBits
    let snowflakeId = timestamp.sub(this.start).shiftLeft(this.machineBits);

    // | machineId
    snowflakeId = snowflakeId.or(this.machineId);

    // << sequenceBits
    snowflakeId = snowflakeId.shiftLeft(this.sequenceBits);

    // | counter
    snowflakeId = snowflakeId.or(this.counter);

    this.lastTimestamp = timestamp;

    // Return as string to avoid JS precision loss with standard numbers
    return snowflakeId.toString();
  }
}
