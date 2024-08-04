import { React, useState } from "react";
import {
  Heading,
  Image,
  Text,
  Badge,
  Button,
  Input,
  Modal,
  FormControl,
  Box,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormLabel,
  Center,
  Card,
  useToast,
  SimpleGrid,
  Flex,
  Wrap,
  WrapItem,
  Container,
  Stack,
} from "@chakra-ui/react";
import { useLoaderData, useNavigate } from "react-router-dom";

export const loader = async ({ params }) => {
  const event = await fetch(`http://localhost:3000/events/${params.eventId}`);
  const categories = await fetch("http://localhost:3000/categories");
  const users = await fetch("http://localhost:3000/users");

  return {
    event: await event.json(),
    categories: await categories.json(),
    users: await users.json(),
  };
};

export const EventPage = () => {
  const { event, categories, users } = useLoaderData();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [image, setImage] = useState(event.image);
  const [location, setLocation] = useState(event.location);
  const [categoryIds, setCategoryIds] = useState(event.categoryIds);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);

  const createdBy = users.find((user) => user.id === event.createdBy);

  const toast = useToast();
  const navigate = useNavigate();

  const handleUpdateEvent = async (e) => {
    // console.log("event:", event);
    // console.log("update createdBy:", createdBy);

    // console.log("update test");

    e.preventDefault();
    // console.log("update e:", e);
    const editEventData = {
      createdBy: createdBy.id,
      title,
      description,
      image,
      categoryIds,
      location,
      startTime,
      endTime,
    };
    // console.log("update eventData:", editEventData);

    const editEvent = async () => {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEventData),
      });
      // console.log("update response:", response);

      if (!response.ok) {
        throw new Error(`Failed to edit event. Status: ${response.status}`);
      }
      return response.json();
    };

    try {
      await toast.promise(editEvent(), {
        loading: { title: "Updating...", description: "Please wait" },
        success: {
          title: "Event successfully updated",
          description: "Looks great",
          isClosable: true,
          duration: 5000,
        },
        error: {
          title: "Failed to edit event",
          description: "Something went wrong",
        },
      });
      const id = (await editEvent()).id;
      navigate(`/event/${id}`);
    } catch (error) {
      console.error("Error during editing event:", error);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure youu want to delete this event?")) {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete event");
        toast({
          title: "Failed to delete event",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Event successfully deleted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
        // console.log("event deleted");
      }
    }
  };

  return (
    <Container maxW="xxl">
      {/* SHOW EVENT DETAILS */}
      <Center>
        <Card
          bg="white"
          m="5"
          p="5"
          borderTopRightRadius="50"
          borderBottomLeftRadius="50"
        >
          <Image
            w="500px"
            h="250"
            mb="5"
            borderRadius="lg"
            borderTopRightRadius="35"
            objectFit="cover"
            src={event.image}
            als={event.title}
          />

          <div>
            <Heading fontSize="2em" color="tomato" pb="2">
              {event.title}
            </Heading>
            <Text pb="2" fontWeight="semibold">
              {event.description}
            </Text>
            <Text pb="2" fontSize={{ base: "xs", sm: "1em" }}>
              📍 {event.location}
            </Text>
            <Text fontWeight="light">
              Start:{" "}
              {new Date(event.startTime)
                .toLocaleString()
                .replace(/(.*)\D\d+/, "$1")}
            </Text>
            <Text fontWeight="light">
              End:{" "}
              {new Date(event.endTime)
                .toLocaleString()
                .replace(/(.*)\D\d+/, "$1")}
            </Text>

            {categories
              .filter((category) => event.categoryIds.includes(category.id))

              .map((category) => (
                <Badge
                  bg="tomato"
                  color="beige"
                  mt="2"
                  mb="2"
                  mr="1"
                  key={category.id}
                >
                  {category.name}
                </Badge>
              ))}

            <SimpleGrid columns={2}>
              <Box>
                <Text fontSize="xs" m="1">
                  Author: {createdBy.name}
                </Text>
                <Image
                  borderRadius="lg"
                  borderBottomLeftRadius="35"
                  boxSize="100px"
                  src={createdBy.image}
                  alt={createdBy.name}
                ></Image>
              </Box>

              {/* EDIT AND DELETE BUTTON */}
              <Flex align="end" justify="right">
                <Box flexShrink={0}>
                  <Button
                    size={{ base: "xs", sm: "md" }}
                    mr={{ base: "1", sm: "2" }}
                    bg="yellow"
                    _hover={{ bg: "orange" }}
                    onClick={onOpen}
                  >
                    Edit event
                  </Button>

                  <Button
                    size={{ base: "xs", sm: "md" }}
                    colorScheme="red"
                    onClick={handleDeleteEvent}
                  >
                    Delete event
                  </Button>

                  {/* FORM EDIT EVENT */}
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Edit event details</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody>
                        <form onSubmit={handleUpdateEvent}>
                          <FormControl>
                            <FormLabel>Event name:</FormLabel>
                            <Input
                              type="text"
                              value={title}
                              placeholder="title"
                              onChange={(e) => setTitle(e.currentTarget.value)}
                            />
                            <FormLabel mt="2">Description:</FormLabel>
                            <Input
                              type="text"
                              value={description}
                              placeholder="description"
                              onChange={(e) =>
                                setDescription(e.currentTarget.value)
                              }
                            />
                            <FormLabel mt="2">Add image</FormLabel>
                            <Input
                              type="url"
                              value={image}
                              placeholder="image url"
                              onChange={(e) => setImage(e.currentTarget.value)}
                            />
                            <FormLabel mt="2">Location:</FormLabel>
                            <Input
                              type="text"
                              value={location}
                              placeholder="location"
                              onChange={(e) =>
                                setLocation(e.currentTarget.value)
                              }
                            />
                            <FormLabel mt="2">Categories</FormLabel>
                            <Stack>
                              <select
                                value={categoryIds}
                                multiple={true}
                                onChange={(e) => {
                                  const values = Array.from(
                                    e.currentTarget.selectedOptions,
                                    (option) => option.value
                                  );
                                  setCategoryIds(values.map(Number));
                                }}
                              >
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </Stack>

                            <FormLabel mt="2">Start time:</FormLabel>
                            <Input
                              type="datetime-local"
                              value={startTime}
                              placeholder="Select start date and time"
                              onChange={(e) =>
                                setStartTime(e.currentTarget.value)
                              }
                            />
                            <FormLabel mt="2">End time:</FormLabel>
                            <Input
                              type="datetime-local"
                              value={endTime}
                              placeholder="Select end date and time"
                              onChange={(e) =>
                                setEndTime(e.currentTarget.value)
                              }
                            />
                          </FormControl>
                          <Wrap mt="5">
                            <WrapItem>
                              <Button
                                colorScheme="green"
                                type="submit"
                                onClick={onClose}
                              >
                                Save event
                              </Button>
                            </WrapItem>
                            <WrapItem>
                              <Button onClick={onClose}>Cancel</Button>
                            </WrapItem>
                          </Wrap>
                        </form>
                      </ModalBody>
                      <ModalFooter></ModalFooter>
                    </ModalContent>
                  </Modal>
                </Box>
              </Flex>
            </SimpleGrid>
          </div>
        </Card>
      </Center>
    </Container>
  );
};
