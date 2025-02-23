import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import axios from "axios";
import "./WorkRotation.css";

// Define TypeScript interface for a worker
interface Worker {
    name: string;
    status: "willWork" | "working" | "worked";
}

const rotationDays = 1;

// Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
    return new Date().toISOString().split("T")[0];
};

// Retrieve stored start date or default to 20-Feb-2025
const getStoredStartDate = (): Date => {
    const dateString = "2025-02-21";
    return new Date(dateString);
};

const WorkRotation: React.FC = () => {
    const [workSchedule, setWorkSchedule] = useState<Worker[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date>(getStoredStartDate());

    // Fetch workers data from the backend
    useEffect(() => {
        axios.get<Worker[]>("http://localhost:5000/workers")
            .then(response => {
                setWorkSchedule(response.data);
            })
            .catch(error => console.error("Error fetching workers:", error));
    }, []);

    // Calculate how many days have passed since startDate
    useEffect(() => {
        if (workSchedule.length === 0) return;

        const today = new Date(getTodayDate());
        const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        let newIndex = (diffDays * rotationDays) % workSchedule.length;
        setCurrentIndex(newIndex);
    }, [workSchedule.length, startDate]);

    // Update worker statuses whenever the index changes
    useEffect(() => {
        if (workSchedule.length === 0) return;

        setWorkSchedule(prevSchedule => {
            const updatedSchedule = prevSchedule.map((worker, index) => ({
                ...worker,
                status: index < currentIndex ? "worked"
                    : index < currentIndex + rotationDays ? "working"
                        : "willWork"
            }));

            // Save to backend
            axios.post("http://localhost:5000/workers", updatedSchedule)
                .catch(error => console.error("Error updating workers:", error));

            return updatedSchedule;
        });
    }, [currentIndex]);

    // Handle drag-and-drop logic
    const onDragEnd = (result: DropResult): void => {
        if (!result.destination) return;

        const items = Array.from(workSchedule);
        const [reorderedItem] = items.splice(result.source.index, 1);

        // Prevent dragging into the "worked" section
        if (workSchedule[result.destination.index]?.status === "worked") return;

        // Allow dragging only if status is "willWork" or "working"
        if (reorderedItem.status !== "willWork" && reorderedItem.status !== "working") return;

        // If a "working" worker is moved, change it back to "willWork"
        if (reorderedItem.status === "working") {
            reorderedItem.status = "willWork";
        }

        items.splice(result.destination.index, 0, reorderedItem);

        // Find the last "worked" index
        const lastWorkedIndex = items.findLastIndex(worker => worker.status === "worked");

        // Ensure only the first "willWork" after "worked" becomes "working"
        let firstWillWorkFound = false;
        items.forEach((worker, index) => {
            if (index === lastWorkedIndex + 1 && worker.status === "willWork" && !firstWillWorkFound) {
                worker.status = "working";
                firstWillWorkFound = true;
            } else if (index > lastWorkedIndex + 1) {
                worker.status = "willWork";
            }
        });

        setWorkSchedule(items);

        // Save updated order to backend
        axios.post("http://localhost:5000/workers", items)
            .catch(error => console.error("Error saving worker order:", error));
    };

    return (
        <div className="container">
            <h2>Work Rotation</h2>
            <p>Start Date: {startDate.toISOString().split("T")[0]}</p>
            <p>Current Worker Index: {currentIndex}</p>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workList">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="list">
                            {workSchedule.map((worker, index) => (
                                <Draggable
                                    key={index}
                                    draggableId={worker.name + index}
                                    index={index}
                                    isDragDisabled={worker.status !== "willWork" && worker.status !== "working"}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`box ${worker.status}`}
                                        >
                                            {worker.name}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default WorkRotation;
