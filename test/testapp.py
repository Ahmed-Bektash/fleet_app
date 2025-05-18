from mqtt.publisher import publish
from mqtt.subscriber import subscribe
if __name__ == "__main__":
    # Test the publish function
    publish("Hello, MQTT!")
    # Test the subscribe function
    subscribe("/subscribe")
    print("Test app is running.")
