import { AutoMap } from '@web-arena/es-named-imports/@automapper/classes';
import { ObjectId } from 'mongoose';

class UserDto {
  id: ObjectId;

  @AutoMap()
  tag: string;

  @AutoMap()
  email: string;

  @AutoMap()
  photo: string;
}

export default UserDto;
