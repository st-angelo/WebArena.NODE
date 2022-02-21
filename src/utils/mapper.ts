import { classes } from '@web-arena/es-named-imports/@automapper/classes';
import {
  createMapper,
  mapFrom,
} from '@web-arena/es-named-imports/@automapper/core';
import UserDto from '../data/dto/userDto.js';
import User from '../data/entities/user.js';

const mapper = createMapper({
  name: 'main',
  pluginInitializer: classes,
});

mapper.createMap(User, UserDto).forMember(
  destination => destination.id,
  mapFrom(source => source._id)
);

export default mapper;
