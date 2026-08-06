package com.app.bs.BookingSystem.modules.showSeats;

import com.app.bs.BookingSystem.modules.seats.Seat;
import com.app.bs.BookingSystem.modules.shows.Show;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "show_seats",uniqueConstraints = {
        @UniqueConstraint(name = "show_seats", columnNames = {"show_id","seat_id"})
})
public class ShowSeat {
    @Id
    @GeneratedValue
    private UUID id;

//    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

//    @SuppressWarnings("JpaDataSourceORMInspection")
    @ManyToOne
    @JoinColumn(name = "show_id")
    private Show show;

    @Enumerated(EnumType.STRING)
    private ShowSeatStatus seatStatus = ShowSeatStatus.AVAILABLE;

    @Version
    private Long version;
}
