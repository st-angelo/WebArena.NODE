import { createMapper, mapFrom } from '@automapper/core';
import { classes } from '@automapper/classes';
import User from '../data/entities/user.mjs';
import UserDto from '../data/dto/userDto.mjs';

const mapper = createMapper({
  name: 'main',
  pluginInitializer: classes,
});

mapper.createMap(User, UserDto).forMember(
  destination => destination.id,
  mapFrom(source => source._id)
);

export default mapper;
