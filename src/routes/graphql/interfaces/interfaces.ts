export interface CreatePostDto {
  title: string;
  content: string;
  authorId: string;
}

export interface ChangePostDto {
  id: string;
  dto: Partial<CreatePostDto>;
}

export interface CreateUserDto {
  name: string;
  balance: number;
}

export interface ChangeUserDto {
  id: string;
  dto: Partial<CreateUserDto>;
}

export interface CreateProfileDto {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
}

export interface ChangeProfileDto {
  id: string;
  dto: Partial<CreateProfileDto>;
}

export interface SubsDto {
  userId: string;
  authorId: string;
}