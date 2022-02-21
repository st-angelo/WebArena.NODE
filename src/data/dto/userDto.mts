import { ObjectId } from 'mongoose';
import { AutoMap } from '../../utils/imports/automapper.mjs';

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
