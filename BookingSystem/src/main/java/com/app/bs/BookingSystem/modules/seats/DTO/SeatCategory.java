package com.app.bs.BookingSystem.modules.seats.DTO;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@AllArgsConstructor 
@NoArgsConstructor 
public class SeatCategory {
    String category;
    List<Pair> pair;
}
