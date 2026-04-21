from pydantic import BaseModel, ConfigDict, Field


class ProductBase(BaseModel):
    category: str
    description: str = Field(min_length=5, max_length=2000)
    image: str = Field(min_length=1, max_length=255)
    isAvailable: bool
    price: int = Field(ge=0)
    stock: int = Field(ge=0)
    title: str = Field(min_length=2, max_length=255)


class ProductCreateRequest(ProductBase):
    pass


class ProductUpdateRequest(ProductBase):
    pass


class ProductAvailabilityRequest(BaseModel):
    isAvailable: bool


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    title: str
    description: str
    price: int
    image: str
    category: str
    stock: int
    isAvailable: bool = Field(validation_alias="is_available")
    tags: list[str]
