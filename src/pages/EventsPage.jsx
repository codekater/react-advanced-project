import { React, useState } from "react";
import { useLoaderData, Link } from "react-router-dom";
import {
  Heading,
  Image,
  Text,
  SimpleGrid,
  Card,
  CardBody,
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
  Stack,
  Divider,
  Center,
  Flex,
  Spacer,
  WrapItem,
  Wrap,
  Container,
  Select,
} from "@chakra-ui/react";

export const loader = async () => {
  const events = await fetch("http://localhost:3000/events");
  const categories = await fetch("http://localhost:3000/categories");
  const users = await fetch("http://localhost:3000/users");

  return {
    events: await events.json(),
    categories: await categories.json(),
    users: await users.json(),
  };
};

export const EventsPage = () => {
  const [search, setSearch] = useState("");
  const { events, categories, users } = useLoaderData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createdBy, setCreatedBy] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddEvent = async (e) => {
    // console.log("createdBy:", createdBy);
    e.preventDefault();
    // console.log("e:", e);
    const eventData = {
      createdBy,
      title,
      description,
      image,
      categoryIds,
      location,
      startTime,
      endTime,
    };
    // console.log("eventData:", eventData);

    const response = await fetch("http://localhost:3000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    // console.log("response:", response);

    if (response.ok) {
      console.log("response:ok");
    } else {
      console.log("response no good");
    }
    window.location.reload();
  };

  return (
    <div>
      <Container maxW="xxl" h="full">
        <Center>
          <SimpleGrid justifyItems="center">
            {/* SEARCH */}
            <Box m="5">
              <Input
                focusBorderColor="tomato"
                bg="beige"
                placeholder="Search events"
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
            </Box>

            {/* UPCOMING EVENTS + ADD EVENT */}
            <Flex display={{ sm: "flex" }} align={{ base: "center" }}>
              <Box flexShrink={0}>
                <Heading fontSize={{ base: "26px", md: "30px" }} color="white">
                  Upcoming events
                </Heading>
              </Box>
              <Spacer />
              <Box pl={{ sm: "5", md: "5" }} mt={{ base: "2" }}>
                <Button bg="yellow" _hover={{ bg: "orange" }} onClick={onOpen}>
                  Add event
                </Button>
              </Box>
            </Flex>

            {/* FORM ADD EVENT */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>New event details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <form onSubmit={handleAddEvent}>
                    <FormControl isRequired>
                      <FormLabel>Select author:</FormLabel>
                      <Select
                        placeholder="Select author"
                        value={createdBy}
                        onChange={(e) => setCreatedBy(+e.target.value)}
                      >
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </Select>
                      <FormLabel mt="2">Event name:</FormLabel>
                      <Input
                        type="text"
                        value={title}
                        placeholder="title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <FormLabel mt="2">Description:</FormLabel>
                      <Input
                        type="text"
                        value={description}
                        placeholder="description"
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <FormLabel mt="2">Add image</FormLabel>
                      <Input
                        type="url"
                        value={image}
                        placeholder="image url"
                        onChange={(e) => setImage(e.target.value)}
                      />
                      <FormLabel mt="2">Location:</FormLabel>
                      <Input
                        type="text"
                        value={location}
                        placeholder="location"
                        onChange={(e) => setLocation(e.target.value)}
                      />
                      <FormLabel mt="2">Select categories</FormLabel>
                      <Stack>
                        <select
                          value={categoryIds}
                          multiple={true}
                          required
                          onChange={(e) => {
                            const values = Array.from(
                              e.target.selectedOptions,
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
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <FormLabel mt="2">End time:</FormLabel>
                      <Input
                        type="datetime-local"
                        value={endTime}
                        placeholder="Select end date and time"
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </FormControl>
                    <Wrap mt="5">
                      <WrapItem>
                        <Button
                          colorScheme="green"
                          type="submit"
                          onClick={onClose}
                        >
                          Add event
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
          </SimpleGrid>
        </Center>

        {/* SEARCH FILTER */}
        <SimpleGrid minChildWidth="300px" justifyItems="center">
          {events
            .filter((event) => {
              const matchedEvent = event.title
                .toLowerCase()
                .includes(search.toLowerCase());

              const matchedCategories = Array.isArray(event.categoryIds)
                ? event.categoryIds
                    .map(
                      (categoryId) =>
                        categories.find(
                          (category) => category.id === categoryId
                        )?.name
                    )
                    .some((categoryName) =>
                      categoryName.toLowerCase().includes(search.toLowerCase())
                    )
                : false;
              return matchedEvent || matchedCategories;
            })

            // SHOW EVENTS
            .map((event) => (
              <Link key={event.id} to={`/event/${event.id}`}>
                <Card maxW="sm" m="5">
                  <CardBody>
                    <Image
                      w={350}
                      h={200}
                      src={event.image}
                      alt={event.title}
                      borderRadius="lg"
                      objectFit="cover"
                    />
                    <Stack mt="6">
                      <Heading size="md">{event.title}</Heading>
                      <Text>{event.description}</Text>
                      <Divider
                        color="yellow"
                        border="2px"
                        borderBottomColor="gray.200"
                      />
                      <Text fontSize="sm">
                        Start:{" "}
                        {new Date(event.startTime)
                          .toLocaleString()
                          .replace(/(.*)\D\d+/, "$1")}
                      </Text>
                      <Text fontSize="sm">
                        End:{" "}
                        {new Date(event.endTime)
                          .toLocaleString()
                          .replace(/(.*)\D\d+/, "$1")}
                      </Text>
                    </Stack>

                    {categories
                      .filter((category) =>
                        event.categoryIds.includes(category.id)
                      )

                      .map((category) => (
                        <Badge
                          bg="tomato"
                          color="beige"
                          mt="2"
                          mr="1"
                          key={category.id}
                        >
                          {category.name}
                        </Badge>
                      ))}
                  </CardBody>
                </Card>
              </Link>
            ))}
        </SimpleGrid>
      </Container>
    </div>
  );
};
